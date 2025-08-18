"use server";

import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getString } from "@/lib/utils/form";



export async function getPatientAppointments() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId, role: "PATIENT" },
      select: { id: true },
    });
    if (!user) throw new Error("User not found");

    const appointments = await db.appointment.findMany({
      where: { patientId: user.id },
      include: {
        doctor: {
          select: { id: true, name: true, specialty: true, imageUrl: true, email: true },
        },
      },
      orderBy: { startTime: "asc" },
    });

    return { appointments, error: null };
  } catch (error:any) {
    return { appointments: [], error: error.message };
  }
}
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

export async function cancelAppointment(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const actor = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!actor) throw new Error("User not found");

  const appointmentId = getString(formData, "appointmentId");

  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId },
    include: { patient: true, doctor: true },
  });
  if (!appointment) throw new Error("Appointment not found");

  if (appointment.doctorId !== actor.id && appointment.patientId !== actor.id) {
    throw new Error("You are not authorized to cancel this appointment");
  }

  await db.$transaction(async (tx) => {
    await tx.appointment.update({
      where: { id: appointmentId },
      data: { status: "CANCELED" },
    });

    // Reverse the earlier 2-credit transfer
    await tx.creditTransaction.createMany({
      data: [
        { userId: appointment.patientId, amount: 2, type: "APPOINTMENT_DEDUCTION", description: "Refund (cancelled appointment)" },
        { userId: appointment.doctorId, amount: -2, type: "APPOINTMENT_DEDUCTION", description: "Reversal (cancelled appointment)" },
      ],
    });

    await tx.user.update({ where: { id: appointment.patientId }, data: { creadits: { increment: 2 } } });
    await tx.user.update({ where: { id: appointment.doctorId }, data: { creadits: { decrement: 2 } } });
  });

  revalidatePath(actor.role === "DOCTOR" ? "/doctor" : "/appointments");
  return { success: true };
}

export async function addAppointmentNotes(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const doctor = await db.user.findUnique({ where: { clerkUserId: userId, role: "DOCTOR" } });
  if (!doctor) throw new Error("No doctor found");

  const appointmentId = getString(formData, "appointmentId");
  const notes = getString(formData, "notes");

  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId, doctorId: doctor.id },
  });
  if (!appointment) throw new Error("No appointment found");

  const updated = await db.appointment.update({ where: { id: appointmentId }, data: { notes } });

  revalidatePath("/doctor");
  return { success: true, appointment: updated };
}

export async function markAppointmentCompleted(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const doctor = await db.user.findUnique({ where: { clerkUserId: userId, role: "DOCTOR" } });
  if (!doctor) throw new Error("No doctor found");

  const appointmentId = getString(formData, "appointmentId");

  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId, doctorId: doctor.id },
    include: { patient: true },
  });
  if (!appointment) throw new Error("No appointment found");

  if (appointment.status !== "SCHEDULED") {
    throw new Error("Only scheduled appointments can be marked as completed");
  }

  const now = new Date();
  const end = new Date(appointment.endTime);
  if (now < end) throw new Error("Cannot mark appointment as completed before the scheduled end time");

  const updated = await db.appointment.update({
    where: { id: appointmentId },
    data: { status: "COMPLETED" },
  });

  revalidatePath("/doctor");
  return { success: true, appointment: updated };
}
