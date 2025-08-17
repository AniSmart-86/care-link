"use server"

import { $Enums } from "@/lib/generated/prisma";
import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";


type userType ={
    transactions: any;
    role: $Enums.UserRole;
    name: string | null;
    id: string;
    clerkUserId: string;
    email: string;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    creadits: number;
    specialty: string | null;
    experience: number | null;
    credentialUrl: string | null;
    description: string | null;
    verificationStatus: $Enums.VerificationStatus | null;
}


const PLAN_CREDITS = {
    free_user: 0,
    standard: 10,
    premium:24,
}

const APPOINTMENT_CREDIT_COST = 2;

export async function allocateCredits({ user }: { user: userType }) {
  try {
    if (!user) return null;

    if (user.role !== "PATIENT") {
      return user;
    }

    if (user.createdAt === user.updatedAt) {
      // New patient, allocate 2 credits
      const creditsToAllocate = 2;

      // Allocate credits
      const updatedUser = await db.$transaction(async (tx) => {
        await tx.creditTransaction.create({
          data: {
            userId: user.id,
            amount: creditsToAllocate,
            type: "CREDIT_PURCHASE",
          },
        });
        // Update user's credits
        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            creadits: {
              increment: creditsToAllocate,
            },
          },
        });
        return updatedUser;
      });

      revalidatePath("/doctors");
      revalidatePath("/appointments");

      return updatedUser;
    } else {
      // Existing patient, check if credits need to be allocated
      const { has } = await auth();

      const hasFree = has({ plan: "free_user" });
      const hasStandard = has({ plan: "standard" });
      const hasPremium = has({ plan: "premium" });

      let currentPlan = null;
      let creditsToAllocate = 0;

      if (hasPremium) {
        currentPlan = "premium";
        creditsToAllocate = PLAN_CREDITS.premium;
      } else if (hasStandard) {
        currentPlan = "standard";
        creditsToAllocate = PLAN_CREDITS.standard;
      } else if (hasFree) {
        currentPlan = "free_user";
        creditsToAllocate = PLAN_CREDITS.free_user;
      }

      if (!currentPlan) {
        return user;
      }

      const currentMonth = format(new Date(), "MMMM yyyy"); // date-fns

      if (user.transactions.length > 0) {
        const lastestTransaction = user.transactions[0];
        const TransactionMonth = format(new Date(lastestTransaction.createdAt), "MMMM yyyy");

        const transactionPlan = lastestTransaction.packageId;
        if (TransactionMonth === currentMonth && transactionPlan === currentPlan) {
          return user; // Credits already allocated for this month
        }
      }

      // Allocate credits
      const updatedUser = await db.$transaction(async (tx) => {
        await tx.creditTransaction.create({
          data: {
            userId: user.id,
            amount: creditsToAllocate,
            type: "CREDIT_PURCHASE",
            packageId: currentPlan,
          },
        });
        // Update user's credits
        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            creadits: {
              increment: creditsToAllocate,
            },
          },
        });
        return updatedUser;
      });

      revalidatePath("/doctors");
      revalidatePath("/appointments");

      return updatedUser;
    }
  } catch (error) {
    console.error("Error allocating credits:", error);
    throw new Error("Failed to allocate credits");
  }
}

export async function deductCreditsForAppointment(userId: string, doctorId: string){
try {
    const user = await db.user.findUnique({
where:{id: userId}        
    });

 if (!user) {
        throw new Error("User not found");
    }    
    
    const doctor = await db.user.findUnique({
        where:{id: doctorId},        
    });

if(user.creadits < APPOINTMENT_CREDIT_COST){

throw new Error("Insufficient credits to book appointment with this doctor");    
}


if(!doctor){
throw new Error("doctor not found");    
}

const result = await db.$transaction(async(tx)=>{

await tx.creditTransaction.create({
data:{
    userId: user.id, 
    amount: -APPOINTMENT_CREDIT_COST,
    type: "APPOINTMENT_DEDUCTION", 

    // description: `Credits deducted  for appointment with Dr. ${doctor.name}`
}    
});

await tx.creditTransaction.create({
data:{
    userId: doctor.id, 
    amount: APPOINTMENT_CREDIT_COST,
    type: "APPOINTMENT_DEDUCTION", 
    
    // description: `Credits deducted  for appointment with Dr. ${doctor.name}`
},    
});

//update user credit balance
const updatedUser = tx.user.update({
where:{
id:user.id,    
},
data:{
creadits:{
decrement:APPOINTMENT_CREDIT_COST    
},    
},    
});
//update doctor credit balance
await tx.user.update({
where:{
id:doctor.id,    
},
data:{
creadits:{
increment:APPOINTMENT_CREDIT_COST    
},    
},    
});
return updatedUser;

});



return {success: true, user: result}

} catch (error:any) {
    return {success: false, error: error.message}
    
}    
};