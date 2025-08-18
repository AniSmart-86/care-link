"use server";

import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getString, getDate } from "@/lib/utils/form";

export async function setAvailabilitySlots(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const doctor = await db.user.findUnique({
    where: { clerkUserId: userId, role: "DOCTOR" },
  });
  if (!doctor) throw new Error("Doctor not found");

  const startTime = getDate(formData, "startTime");
  const endTime = getDate(formData, "endTime");

  if (startTime >= endTime) throw new Error("Start time must be before end time");

  // Remove previous unbooked slots
  const existing = await db.availability.findMany({
    where: { doctorId: doctor.id },
    include: { appointment: true },
  });
  const deletable = existing.filter((s) => !s.appointment?.length);
  if (deletable.length) {
    await db.availability.deleteMany({ where: { id: { in: deletable.map((s) => s.id) } } });
  }

  const slot = await db.availability.create({
    data: { doctorId: doctor.id, startTime, endTime, status: "AVAILABLE" },
  });

  revalidatePath("/doctor");
  return { success: true, slot };
}

export async function getDoctorsAvailability() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

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
