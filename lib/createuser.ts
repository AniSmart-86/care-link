import { currentUser } from "@clerk/nextjs/server";
import db from "./prisma";




export const createUser = async () => {
  // Get the current user from Clerk
  const user = await currentUser();
 console.log(user)
  if (!user){
    return null;
  };

  try {
  
    const existingUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
      include: {
        transactions: {
          where: {
            type: "CREDIT_PURCHASE",
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (existingUser) {
      return existingUser;
    }

    // Create new user
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
    const email = user.emailAddresses[0].emailAddress || "";

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        email,
        name,
        imageUrl: user.imageUrl || "",
        transactions:{
          create:{
            type: "CREDIT_PURCHASE",
            packageId: "free_user",
            amount: 0,
          }
        }
      },

      
    });

    console.log(newUser)
    return newUser;

  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};
