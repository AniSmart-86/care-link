"use server";

import axios from "axios";
import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function verifyDrugByNafdac(nafdacNumber: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // 1. Get the current user
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.creadits < 1) {
      throw new Error("Insufficient credits to verify drug");
    }

    // 2. Fetch from EMDEX API
    const { data } = await axios.get(
      `https://sandbox.emdexapi.com/api/v1/brand/search`,
      {
        params: { nafdac: nafdacNumber },
        headers: {
          Authorization: `Bearer ${process.env.EMDEX_API_KEY}`, // store API key in env
        },
      }
    );

    // 3. Deduct 1 credit from user
    await db.user.update({
      where: { id: user.id },
      data: { creadits: { decrement: 1 } },
    });

    // 4. Add 1 credit to admin
    const admin = await db.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (admin) {
      await db.user.update({
        where: { id: admin.id },
        data: { creadits: { increment: 1 } },
      });
    }

    // 5. Revalidate user dashboard or credit display
    revalidatePath("/dashboard");

    // 6. Return drug data
    return { success: true, data };
  } catch (error: any) {
    console.error("Drug verification failed:", error.message);
    throw new Error("Failed to verify drug: " + error.message);
  }
}
