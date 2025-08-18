"use server";

import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import type { PlanId } from "@/lib/types";
import { allocateCredits } from "./credits";
import { getString } from "@/lib/utils/form";

export async function setUserRole(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { transactions: true },
  });
  if (!user) throw new Error("User not found");

  const role = getString(formData, "role");
  if (!["PATIENT", "DOCTOR"].includes(role)) throw new Error("Invalid role");

  if (role === "PATIENT") {
    await db.user.update({
      where: { clerkUserId: userId },
      data: { role: "PATIENT" },
    });

    await allocateCredits({ user, plan: "free_user" }); // welcome + (optional) plan monthly

    revalidatePath("/");
    return { success: true, redirect: "/doctors" as const };
  }

  // DOCTOR path
  const specialty = getString(formData, "specialty");
  const experienceStr = getString(formData, "experience");
  const credentialUrl = getString(formData, "credentialUrl");
  const description = getString(formData, "description");

  const experience = Number.parseInt(experienceStr, 10);
  if (!Number.isFinite(experience) || experience < 0) {
    throw new Error("experience must be a valid non-negative integer");
  }

  await db.user.update({
    where: { clerkUserId: userId },
    data: {
      role: "DOCTOR",
      specialty,
      experience,
      credentialUrl,
      description,
      verificationStatus: "PENDING",
    },
  });

  revalidatePath("/doctors");
  return { success: true, redirect: "/doctor/verification" as const };
}

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { transactions: true },
  });
  if (!user) throw new Error("User not found");
  return user;
}
