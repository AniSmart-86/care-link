"use server";

import db from "@/lib/prisma";

export async function getDoctorsBySpecialty(specialty: string) {
  try {
    const normalized = specialty.split("%20").join(" ");
    const doctors = await db.user.findMany({
      where: {
        role: "DOCTOR",
        specialty: normalized,
        verificationStatus: "VERIFIED",
      },
      orderBy: { name: "asc" },
    });
    return { doctors };
  } catch (err) {
    console.error("Error fetching doctors by specialty:", err);
    return { error: "Failed to fetch doctors" };
  }
}
