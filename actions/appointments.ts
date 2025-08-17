"use server";

import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
// import { constants } from "buffer";
import { addDays, addMinutes, endOfDay, format, isBefore } from "date-fns";
import { deductCreditsForAppointment } from "./credits";
import { revalidatePath } from "next/cache";
import { Vonage } from "@vonage/server-sdk";
import { Auth } from "@vonage/auth";
import { MediaMode } from '@vonage/video';

type AvailabilitySlot = {

  startTime: Date;
  endTime: Date;
  formatted: string;
  day: string;
};





const credentials = new Auth({
  applicationId: process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID,
  privateKey: process.env.NEXT_PUBLIC_VONAGE_PRIVATE_KEY,
});

const vonage = new Vonage(credentials, {});

export async function getDoctorById(doctorId: string) {
  try {
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found or not verified");
    }
    return { doctor };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to retrieve doctor");
  }
}

export async function getAvailableTimeSlots(doctorId: string) {
  try {
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found or not verified");
    }

    const availability = await db.availability.findFirst({
      where: {
        doctorId: doctor.id,
        status: "AVAILABLE",
      },
    });

    if (!availability) {
      throw new Error("No availability slots found for this doctor");
    }

    const now = new Date();
    const days = [now, addDays(now, 1), addDays(now, 2), addDays(now, 3)];

    const lastDay = endOfDay(days[3]);

    const existingAppointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: "SCHEDULED",
        startTime: {
          lte: lastDay,
        },
      },
    });

    const availabilitySlotsByDay: { [day: string]: AvailabilitySlot[] } = {};

    for (const day of days) {
      const dayString = format(day, "yyyy-MM-dd");
      availabilitySlotsByDay[dayString] = [];

      const availabilityStart = new Date(availability.startTime);
      const availabilityEnd = new Date(availability.endTime);

      availabilityStart.setFullYear(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      );
      availabilityEnd.setFullYear(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      );

      let current = new Date(availabilityStart);
      const end = new Date(availabilityEnd);

      while (
        isBefore(addMinutes(current, 30), end) ||
        +addMinutes(current, 30) === +end
      ) {
        const next = addMinutes(current, 30);

        if (isBefore(current, now)) {
          current = next;
          continue;
        }

        const overlaps = existingAppointments.some((appointment) => {
          const aStart = new Date(appointment.startTime);
          const aEnd = new Date(appointment.endTime);

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
            formatted: `${format(current, "h:mm a")} - ${format(
              next,
              "h:mm a"
            )}`,
            day: format(current, "EEEE, MMM d"),
          });
        }

        current = next;
      }
    }

    const result = Object.entries(availabilitySlotsByDay).map(
      ([date, slots]) => ({
        date,
        displayDate:
          slots.length > 0
            ? slots[0].day
            : format(new Date(date), "EEEE, MMM d"),
        slots,
      })
    );
    return { days: result };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to retrieve available time slot");
  }
}

export async function bookAppointment(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const patient = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "PATIENT",
      },
    });

    if (!patient) {
      throw new Error("Patient not found");
    }

    const startTimeValue = formData.get("startTime");
    const endTimeValue = formData.get("endTime");
    const doctorIdValue = formData.get("doctorId");

    if (!doctorIdValue || typeof doctorIdValue !== "string") {
      throw new Error("Doctor ID is required and must be a string");
    }

    if (!startTimeValue || typeof startTimeValue !== "string") {
      throw new Error("Start time is required and must be a string");
    }

    if (!endTimeValue || typeof endTimeValue !== "string") {
      throw new Error("End time is required and must be a string");
    }

    const doctorId = doctorIdValue;
    const startTime = new Date(startTimeValue);
    const endTime = new Date(endTimeValue);
   const descEntry = formData.get("description");
const patientDescription = !descEntry || typeof descEntry !== "string" ? null : descEntry;

    if (!doctorId || !startTime || !endTime) {
      throw new Error("Doctor, start time, and end time are required");
    }

    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      throw new Error("doctor not found or not verified");
    }

    if (patient.creadits < 2) {
      throw new Error("Insufficient credits to book an appointment");
    }

    const overLappingAppointment = await db.appointment.findFirst({
      where: {
        doctorId: doctorId,
        status: "SCHEDULED",
        OR: [
          {
            startTime: {
              lte: startTime,
            },
            endTime: {
              gte: startTime,
            },
          },
          {
            startTime: {
              lte: endTime,
            },
            endTime: {
              gte: endTime,
            },
          },
        ],
      },
    });

    if (overLappingAppointment) {
      throw new Error("This time slot is already booked by another patient");
    }

    const sessionId = await createVideoSession();

    const { success, error } = await deductCreditsForAppointment(
      patient.id,
      doctor.id
    );

    if (!success) {
      throw new Error(error || "fail to deduct credts");
    }

    

    const appointment = await db.appointment.create({
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

    revalidatePath("/appointments");
    return { success: true, appointment: appointment };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to book appointment");
  }
}


async function createVideoSession() {
  try {
    const session = await vonage.video.createSession({ mediaMode: MediaMode.ROUTED });
    return session.sessionId;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create video session");
  }
}



export async function generateVideoSession(formData:FormData){
  const {userId} = await auth();

   if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
      where:{
        clerkUserId: userId,
      },
    });

     if (!user) {
    throw new Error("User not found");
  }

  const appointmentIdEntry = formData.get("appointment");
if (!appointmentIdEntry || typeof appointmentIdEntry !== "string") {
  throw new Error("Appointment ID is required and must be a string");
}
const appointmentId: string = appointmentIdEntry;

  const appointment = await db.appointment.findUnique({
    where:{
      id: appointmentId,
    },
  });

   if (!appointment) {
    throw new Error("Appointment not found");
  }

  if(appointment.doctorId !== user.id && appointment.patientId !== user.id){
    throw new Error("You are not allowed to join this call");
  }

  const now = new Date();
  const appointmentTime = new Date(appointment.startTime);
  const timeDifference = (appointmentTime.getTime() - now.getTime()) / (1000 * 60);
  
  if (timeDifference > 30) {
    throw new Error("The call will be available 30 minutes before the scheduled time");
  }


  const appointmentEndTime = new Date(appointment.endTime);

  const expirationTime = Math.floor(appointmentEndTime.getTime() / 1000) + 60 * 60; //1hr after end time

  //user connection details
  const connectionData = JSON.stringify({
    name: user.name ?? "",
    role: user.role,
    userId: user.id
  });

  const token = vonage.video.generateClientToken(appointment.videoSessionId ?? "",{
    role: "publisher",
    expireTime: expirationTime,
    data: connectionData,
  });

  await db.appointment.update({
    where:{
      id: appointmentId,
    },
    data:{
      videoSessionToken: token,
    }
  });

  return {success: true, videoSessionId: appointment.videoSessionId, token: token,}

  } catch (error:any) {
     console.error(error);
    throw new Error("Failed to generate video token" + error.message);
  }
}