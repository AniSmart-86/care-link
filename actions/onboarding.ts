"use server"

import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { allocateCredits } from "./credits";
// import { redirect } from "next/navigation";


export async function setUserRole(formData:FormData){
    const {userId} = await auth();
    if(!userId){
        throw new Error("Unauthorized");
    }

    //find the user by userId
    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: { transactions: true }
    });

    if(!user){
        throw new Error("User not found");
    }
    const role = formData.get("role") as string;
    if(!role || !["PATIENT", "DOCTOR"].includes(role)){
        throw new Error("Role is required");
    }

    try {
        if(role === "PATIENT"){
            // Allocate credits for patient
            await db.user.update({
                where: { clerkUserId: userId },
                data: {
                    role: "PATIENT",
                }
            });
            await allocateCredits({ user });
            revalidatePath("/");
            return { success: true, redirect: "/doctors" };

        }
        if(role === "DOCTOR"){
            // Update user role to DOCTOR
         const specialty = formData.get("specialty") as string;
         const experience = formData.get("experience") as string;
         const credentialUrl = formData.get("credentialUrl") as string;
         const description = formData.get("description") as string;
     if(!specialty || !experience || !credentialUrl || !description){
            throw new Error("All fields are required for doctor registration");
            }
            await db.user.update({
                    where: { clerkUserId: userId },
                    data: {
                        role: "DOCTOR",
                        specialty,
                        experience: parseInt(experience, 10),
                        credentialUrl,
                        description,
                        verificationStatus: "PENDING",
                    }
                });
                revalidatePath("/doctors");
                return { success: true, redirect: "/doctor/verification" };
        }
    } catch (error:any) {
        console.error("Error setting user role:", error);
        throw new Error("Failed to set user role", error.message);
        
    }
} 

export async function getcurrentUser() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }
    
    
    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
           include: { transactions: true }
        });
        return user;
        // You can add onboarding completion logic here if needed
    } catch (error:any) {
        console.error("Error completing onboarding:", error);
        throw new Error("Failed to complete onboarding", error.message);
    }
}