"use server";

import db from "@/lib/prisma";
import { format } from "date-fns";
import type { UserWithTransactions, PlanId } from "@/lib/types";
import { PLAN_CREDITS } from "@/lib/types";

// Welcome credits (first-time patients) and optional monthly allocation by plan.
// To allocate monthly plan credits, pass the plan explicitly.
export async function allocateCredits(input: { user: UserWithTransactions; plan?: PlanId }) {
  const { user, plan } = input;
  if (!user) return null;
  if (user.role !== "PATIENT") return user;

  // first-time (created === updated)
  if (user.createdAt.getTime() === user.updatedAt.getTime()) {
    const amount = 2;
    const updated = await db.$transaction(async (tx) => {
      await tx.creditTransaction.create({
        data: { userId: user.id, amount, type: "CREDIT_PURCHASE", description: "Welcome credits" },
      });
      return tx.user.update({ where: { id: user.id }, data: { creadits: { increment: amount } } });
    });
    return updated;
  }

  if (!plan) return user; // nothing else to do without explicit plan

  const currentMonth = format(new Date(), "MMMM yyyy");
  const last = user.transactions[0];

  if (last) {
    const lastMonth = format(new Date(last.createdAt), "MMMM yyyy");
    if (lastMonth === currentMonth && last.packageId === plan) {
      return user; // already allocated this month
    }
  }

  const amount = PLAN_CREDITS[plan];
  const updated = await db.$transaction(async (tx) => {
    await tx.creditTransaction.create({
      data: {
        userId: user.id,
        amount,
        type: "CREDIT_PURCHASE",
        packageId: plan,
        description: `Monthly allocation: ${plan}`,
      },
    });
    return tx.user.update({ where: { id: user.id }, data: { creadits: { increment: amount } } });
  });

  return updated;
}


// export async function deductCreditsForAppointment(userId: string, doctorId: string){
// try {
//     const user = await db.user.findUnique({
// where:{id: userId}        
//     });

//  if (!user) {
//         throw new Error("User not found");
//     }    
    
//     const doctor = await db.user.findUnique({
//         where:{id: doctorId},        
//     });

// if(user.creadits < APPOINTMENT_CREDIT_COST){

// throw new Error("Insufficient credits to book appointment with this doctor");    
// }


// if(!doctor){
// throw new Error("doctor not found");    
// }

// const result = await db.$transaction(async(tx)=>{

// await tx.creditTransaction.create({
// data:{
//     userId: user.id, 
//     amount: -APPOINTMENT_CREDIT_COST,
//     type: "APPOINTMENT_DEDUCTION", 

//     // description: `Credits deducted  for appointment with Dr. ${doctor.name}`
// }    
// });

// await tx.creditTransaction.create({
// data:{
//     userId: doctor.id, 
//     amount: APPOINTMENT_CREDIT_COST,
//     type: "APPOINTMENT_DEDUCTION", 
    
//     // description: `Credits deducted  for appointment with Dr. ${doctor.name}`
// },    
// });

// //update user credit balance
// const updatedUser = tx.user.update({
// where:{
// id:user.id,    
// },
// data:{
// creadits:{
// decrement:APPOINTMENT_CREDIT_COST    
// },    
// },    
// });
// //update doctor credit balance
// await tx.user.update({
// where:{
// id:doctor.id,    
// },
// data:{
// creadits:{
// increment:APPOINTMENT_CREDIT_COST    
// },    
// },    
// });
// return updatedUser;

// });



// return {success: true, user: result}

// } catch (error:any) {
//     return {success: false, error: error.message}
    
// }    
// };