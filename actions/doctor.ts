"use server";

import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


// ---- Types ----
// ---- Types ----
// type Availability = Prisma.Availability
// type Appointment = Prisma.Appointment & { patient: Prisma.Patient, doctor: Prisma.Doctor }
// type User = Prisma.UserGetPayload<{}>

// ---- Utility to parse form data ----
function getFormValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (!value) throw new Error(`${key} is required`);
  return value.toString();
}

// ---- Set availability ----
export async function setAvailabilitySlots(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const doctor = await db.user.findUnique({
    where: { clerkUserId: userId, role: "DOCTOR" },
  });

  if (!doctor) throw new Error("Doctor not found");

  const startTimeStr = getFormValue(formData,"startTime");
  const endTimeStr = getFormValue(formData,"endTime");

  const startTime = new Date(startTimeStr);
  const endTime = new Date(endTimeStr);

  
  if (!startTimeStr || !endTimeStr) {
    throw new Error("Start time and end time are required");
  }


  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    throw new Error("Invalid date format");
  }
  if (startTime >= endTime) {
    throw new Error("Start time must be before end time");
  }

  const existingSlots = await db.availability.findMany({
  where: { doctorId: doctor.id },
  include:{appointment:true},
   
});


const slotsWithNoAppointment = existingSlots.filter((slot) => !slot.appointment );

if (slotsWithNoAppointment.length > 0) {
  await db.availability.deleteMany({
    where: { id: { in: slotsWithNoAppointment.map((slot) => slot.id) } },
  });
}

  const newSlot = await db.availability.create({
    data: {
      doctorId: doctor.id,
      startTime,
      endTime,
      status: "AVAILABLE",
    },
  });

  revalidatePath("/doctor");
  return { success: true, slot: newSlot };
}

// ---- Get doctor availability ----
export async function getDoctorsAvailability() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const doctor = await db.user.findUnique({
    where: { clerkUserId: userId, role: "DOCTOR" },
  });
  if (!doctor) throw new Error("Doctor not found");

  const slots = await db.availability.findMany({
    where: { doctorId: doctor.id },
    orderBy: { startTime: "asc" },
  });

  return { slots };
}

// ---- Get doctor appointments ----
export async function getDoctorAppointment() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const doctor = await db.user.findUnique({
    where: { clerkUserId: userId, role: "DOCTOR" },
  });
  if (!doctor) throw new Error("No doctor found");

  const appointments = await db.appointment.findMany({
    where: { doctorId: doctor.id, status: { in: ["SCHEDULED"] } },
    include: { patient: true },
    orderBy: { startTime: "asc" },
  });

  return { appointments };
}

// ---- Cancel appointment ----
export async function cancelAppointment(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  const appointmentId = getFormValue(formData, "appointmentId");

  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId },
    include: { patient: true, doctor: true },
  });
  if (!appointment) throw new Error("Appointment not found");

  if (appointment.doctorId !== user.id && appointment.patientId !== user.id) {
    throw new Error("You are not authorized to cancel this appointment");
  }

  await db.$transaction(async tx => {
    await tx.appointment.update({
      where: { id: appointmentId },
      data: { status: "CANCELED" },
    });

    await tx.creditTransaction.createMany({
      data: [
        { userId: appointment.patientId, amount: 2, type: "APPOINTMENT_DEDUCTION" },
        { userId: appointment.doctorId, amount: -2, type: "APPOINTMENT_DEDUCTION" },
      ],
    });

    await tx.user.update({
      where: { id: appointment.patientId },
      data: { creadits: { increment: 2 } },
    });
    await tx.user.update({
      where: { id: appointment.doctorId },
      data: { creadits: { decrement: 2 } },
    });
  });

  revalidatePath(user.role === "DOCTOR" ? "/doctor" : "/appointments");
  return { success: true };
}

// ---- Add appointment notes ----
export async function addAppointmentNotes(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const doctor = await db.user.findUnique({
    where: { clerkUserId: userId, role: "DOCTOR" },
  });
  if (!doctor) throw new Error("No doctor found");

  const appointmentId = getFormValue(formData, "appointmentId");
  const notes = getFormValue(formData, "notes");

  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId, doctorId: doctor.id },
  });
  if (!appointment) throw new Error("No appointment found");

  const updatedAppointment = await db.appointment.update({
    where: { id: appointmentId },
    data: { notes },
  });

  revalidatePath("/doctor");
  return { success: true, appointment: updatedAppointment };
}

// ---- Mark appointment completed ----
export async function markAppointmentCompleted(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const doctor = await db.user.findUnique({
    where: { clerkUserId: userId, role: "DOCTOR" },
  });
  if (!doctor) throw new Error("No doctor found");

  const appointmentId = getFormValue(formData, "appointmentId");

  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId, doctorId: doctor.id },
    include: { patient: true },
  });
  if (!appointment) throw new Error("No appointment found");

  if (appointment.status !== "SCHEDULED") {
    throw new Error("Only scheduled appointments can be marked as completed");
  }

  const now = new Date();
  const appointmentEndTime = new Date(appointment.endTime);
  if (now < appointmentEndTime) {
    throw new Error("Cannot mark appointment as completed before the scheduled end time");
  }

  const updatedAppointment = await db.appointment.update({
    where: { id: appointmentId },
    data: { status: "COMPLETED" },
  });

  revalidatePath("/doctor");
  return { success: true, appointment: updatedAppointment };
}
