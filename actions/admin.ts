"use server"

import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";
import { _success } from "zod/v4/core";

export async function verifyAdmin(){
    const { userId } = await auth();

    if(!userId) return false;
 
    try {
        const user = await db.user.findUnique({
            where:{
                clerkUserId: userId,
            },
        });
        return user?.role === "ADMIN";
    } catch (error) {
        console.log("Error verifying admin",error)
        return false;
        
    }
}

export async function getPendingDoctors(){
    const isAdmin = await verifyAdmin();

    if(!isAdmin) throw new Error("Unauthorized");
    try {
        const pendingDoctors = await db.user.findMany({
            where:{
                role: "DOCTOR",
                verificationStatus: "PENDING",
            },
            orderBy:{
                createdAt: "desc",
            },
        });
        return {doctors: pendingDoctors};
    } catch (error) {
        throw new Error("Failed to fetch pending doctors");
        
    }
}

export async function getVerifiedDoctors(){
    const isAdmin = await verifyAdmin();

    if(!isAdmin) throw new Error("Unauthorized");
    try {
        const verifiedDoctors = await db.user.findMany({
            where:{
                role: "DOCTOR",
                verificationStatus: "VERIFIED",
            },
            orderBy:{
                createdAt: "asc",
            },
        });
        return {doctors: verifiedDoctors};
    } catch (error) {
        throw new Error("Failed to fetch verify doctors");
        
    }
}

export async function updateDoctorsStatus(formData: FormData){
    const isAdmin = await verifyAdmin();

    if(!isAdmin) throw new Error("Unauthorized");

    const doctorId = formData.get("doctorId");
    const status = formData.get("status");

    if (
        typeof doctorId !== "string" ||
        typeof status !== "string" ||
        !["VERIFIED", "REJECTED"].includes(status)
    ) {
        throw new Error("invalid input");
    }

    try {
        await db.user.update({
            where:{
                id: doctorId,
            },
            data:{
                verificationStatus: status as any, 
            }
        });

        revalidatePath("/admin");
        return {success: true}
     
    } catch (error) {
        console.log(error)
        throw new Error("Failed to update doctors status");
        
    }
}


export async function updateDoctorsActiveStatus(formData: FormData){
    const isAdmin = await verifyAdmin();

    if(!isAdmin) throw new Error("Unauthorized");

    const doctorId = formData.get("doctorId");
    const suspend = formData.get("suspend") === "true";

    if (!doctorId) {
        throw new Error("Doctor id is required");
    }

    try {

        const status = suspend ? "PENDING" : "VERIFIED";

        await db.user.update({
            where:{
                id: doctorId as string,
            },
            data:{
                verificationStatus: status, // Cast to enum type
            }
        });

        revalidatePath("/admin");
        return {success: true}
     
    } catch (error) {
        console.log(error)
        throw new Error("Failed to update doctors status");
        
    }
}