"use server"
import db from "@/lib/prisma";


export async function getDoctorsBySpecialty(specialty:string){
    try {
        const doctors = await db.user.findMany({
            where:{
                role:"DOCTOR",
                specialty:specialty.split("%20").join(" "),
                verificationStatus:"VERIFIED"
            },
            orderBy:{
                name:"asc"
            }
        });
        return {doctors};
    } catch (error) {
        console.error("Error fetching doctors by specialty:", error);
        return { error: "Failed to fetch doctors"
    }
}
}