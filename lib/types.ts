
import type { Prisma, CreditTransaction, User } from "@/lib/generated/prisma";

export type UserWithTransactions = User & { transactions: CreditTransaction[] };

export type PlanId = "free_user" | "standard" | "premium";

export const PLAN_CREDITS: Record<PlanId, number> = {
  free_user: 0,
  standard: 10,
  premium: 24,
};

export const APPOINTMENT_CREDIT_COST = 2;
