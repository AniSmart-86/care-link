"use server";

import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import type { $Enums } from "@/lib/generated/prisma";
import { revalidatePath } from "next/cache";
import { getString, getBoolean } from "@/lib/utils/form";

export async function isAdmin(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  return user?.role === "ADMIN";
}

export async function getPendingDoctors() {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const doctors = await db.user.findMany({
    where: { role: "DOCTOR", verificationStatus: "PENDING" },
    orderBy: { createdAt: "desc" },
  });
  return { doctors };
}

export async function getVerifiedDoctors() {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const doctors = await db.user.findMany({
    where: { role: "DOCTOR", verificationStatus: "VERIFIED" },
    orderBy: { createdAt: "asc" },
  });
  return { doctors };
}

export async function updateDoctorsStatus(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const doctorId = getString(formData, "doctorId");
  const status = getString(formData, "status");

  const allowed: $Enums.VerificationStatus[] = ["VERIFIED", "REJECTED"];
  if (!allowed.includes(status as $Enums.VerificationStatus)) {
    throw new Error("Invalid status");
  }

  await db.user.update({
    where: { id: doctorId },
    data: { verificationStatus: status as $Enums.VerificationStatus },
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function updateDoctorsActiveStatus(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const doctorId = getString(formData, "doctorId");
  const suspend = getBoolean(formData, "suspend");

  const nextStatus: $Enums.VerificationStatus = suspend ? "PENDING" : "VERIFIED";

  await db.user.update({
    where: { id: doctorId },
    data: { verificationStatus: nextStatus },
  });

  revalidatePath("/admin");
  return { success: true };
}
