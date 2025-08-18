"use server";

import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { addDays, addMinutes, endOfDay, format, isBefore } from "date-fns";
import { revalidatePath } from "next/cache";
import type { $Enums } from "@/lib/generated/prisma";
import { APPOINTMENT_CREDIT_COST } from "@/lib/types";
import { Vonage } from "@vonage/server-sdk";
import { Auth } from "@vonage/auth";
import { MediaMode } from "@vonage/video";
import { env } from "@/lib/env";
import { getString, getOptionalString, getDate } from "@/lib/utils/form";

type AvailabilitySlot = {
  startTime: Date;
  endTime: Date;
  formatted: string;
  day: string;
};


const credentials = new Auth({
  applicationId: env.VONAGE_APPLICATION_ID,
  privateKey: env.VONAGE_PRIVATE_KEY,
});
const vonage = new Vonage(credentials, {});

// --- helpers ---
async function createVideoSession(): Promise<string> {
  try {
    const session = await vonage.video.createSession({ mediaMode: MediaMode.ROUTED });
    return session.sessionId;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create video session");
  }
}

export async function getDoctorById(doctorId: string) {
  const doctor = await db.user.findUnique({
    where: {
      id: doctorId,
      role: "DOCTOR",
      verificationStatus: "VERIFIED",
    },
  });
  if (!doctor) throw new Error("Doctor not found or not verified");
  return { doctor };
}

export async function getAvailableTimeSlots(doctorId: string) {
  const doctor = await db.user.findUnique({
    where: { id: doctorId, role: "DOCTOR", verificationStatus: "VERIFIED" },
  });
  if (!doctor) throw new Error("Doctor not found or not verified");

  const availability = await db.availability.findFirst({
    where: { doctorId: doctor.id, status: "AVAILABLE" },
  });
  if (!availability) throw new Error("No availability slots found for this doctor");

  const now = new Date();
  const days = [now, addDays(now, 1), addDays(now, 2), addDays(now, 3)];
  const lastDay = endOfDay(days[3]);

  const existingAppointments = await db.appointment.findMany({
    where: {
      doctorId: doctor.id,
      status: "SCHEDULED",
      startTime: { lte: lastDay },
    },
  });

  const availabilitySlotsByDay: Record<string, AvailabilitySlot[]> = {};

  for (const day of days) {
    const dayString = format(day, "yyyy-MM-dd");
    availabilitySlotsByDay[dayString] = [];

    const availabilityStart = new Date(availability.startTime);
    const availabilityEnd = new Date(availability.endTime);

    availabilityStart.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
    availabilityEnd.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());

    let current = new Date(availabilityStart);
    const end = new Date(availabilityEnd);

    while (isBefore(addMinutes(current, 30), end) || +addMinutes(current, 30) === +end) {
      const next = addMinutes(current, 30);

      if (isBefore(current, now)) {
        current = next;
        continue;
      }

      const overlaps = existingAppointments.some((a) => {
        const aStart = new Date(a.startTime);
        const aEnd = new Date(a.endTime);
        return (
          (current >= aStart && current < aEnd) ||
          (next > aStart && next <= aEnd) ||
          (current <= aStart && next >= aEnd)
        );
      });

      if (!overlaps) {
        availabilitySlotsByDay[dayString].push({
          startTime: current,
          endTime: next,
          formatted: `${format(current, "h:mm a")} - ${format(next, "h:mm a")}`,
          day: format(current, "EEEE, MMM d"),
        });
      }

      current = next;
    }
  }

  const daysOut = Object.entries(availabilitySlotsByDay).map(([date, slots]) => ({
    date,
    displayDate: slots.length > 0 ? slots[0].day : format(new Date(date), "EEEE, MMM d"),
    slots,
  }));

  return { days: daysOut };
}

export async function bookAppointment(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const patient = await db.user.findUnique({
    where: { clerkUserId: userId, role: "PATIENT" },
  });
  if (!patient) throw new Error("Patient not found");

  const doctorId = getString(formData, "doctorId");
  const startTime = getDate(formData, "startTime");
  const endTime = getDate(formData, "endTime");
  const patientDescription = getOptionalString(formData, "description");

  const doctor = await db.user.findUnique({
    where: { id: doctorId, role: "DOCTOR", verificationStatus: "VERIFIED" },
  });
  if (!doctor) throw new Error("Doctor not found or not verified");

  if (patient.creadits < APPOINTMENT_CREDIT_COST) {
    throw new Error("Insufficient credits to book an appointment");
  }

  const overlapping = await db.appointment.findFirst({
    where: {
      doctorId,
      status: "SCHEDULED",
      OR: [
        { startTime: { lte: startTime }, endTime: { gte: startTime } },
        { startTime: { lte: endTime }, endTime: { gte: endTime } },
      ],
    },
  });
  if (overlapping) throw new Error("This time slot is already booked by another patient");

  const sessionId = await createVideoSession();

  // debit/credit inside a transaction with appointment creation
  const appointment = await db.$transaction(async (tx) => {
    // Deduct from patient, credit doctor
    await tx.creditTransaction.create({
      data: {
        userId: patient.id,
        amount: -APPOINTMENT_CREDIT_COST,
        type: "APPOINTMENT_DEDUCTION",
        description: `Appointment with Dr. ${doctor.name ?? ""}`,
      },
    });
    await tx.user.update({
      where: { id: patient.id },
      data: { creadits: { decrement: APPOINTMENT_CREDIT_COST } },
    });

    await tx.creditTransaction.create({
      data: {
        userId: doctor.id,
        amount: APPOINTMENT_CREDIT_COST,
        type: "APPOINTMENT_DEDUCTION",
        description: `Appointment booked by ${patient.name ?? ""}`,
      },
    });
    await tx.user.update({
      where: { id: doctor.id },
      data: { creadits: { increment: APPOINTMENT_CREDIT_COST } },
    });

    return tx.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        startTime,
        endTime,
        patientDescription,
        status: "SCHEDULED",
        videoSessionId: sessionId,
      },
    });
  });

  revalidatePath("/appointments");
  return { success: true, appointment };
}

export async function generateVideoSession(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  const appointmentId = getString(formData, "appointment");

  const appointment = await db.appointment.findUnique({ where: { id: appointmentId } });
  if (!appointment) throw new Error("Appointment not found");

  if (appointment.doctorId !== user.id && appointment.patientId !== user.id) {
    throw new Error("You are not allowed to join this call");
  }

  const now = new Date();
  const appointmentTime = new Date(appointment.startTime);
  const diffMin = (appointmentTime.getTime() - now.getTime()) / 60000;
  if (diffMin > 30) throw new Error("The call will be available 30 minutes before the scheduled time");

  const end = new Date(appointment.endTime);
  const expireTime = Math.floor(end.getTime() / 1000) + 60 * 60; // 1hr after end

  const connectionData = JSON.stringify({
    name: user.name ?? "",
    role: user.role,
    userId: user.id,
  });

  const token = vonage.video.generateClientToken(appointment.videoSessionId ?? "", {
    role: "publisher",
    expireTime,
    data: connectionData,
  });

  await db.appointment.update({
    where: { id: appointmentId },
    data: { videoSessionToken: token },
  });

  return { success: true, videoSessionId: appointment.videoSessionId, token };
}
