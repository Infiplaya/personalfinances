"use server";

import { db } from "@/db";
import { balances, transactions } from "@/db/schema/finances";
import { authOptions } from "@/lib/auth/auth";
import { TransactionForm } from "@/lib/validation/transaction";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createNewTransaction(formData: TransactionForm) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) throw new Error();
  try {
    await db.insert(transactions).values({
      ...formData,
      userId: session.user.id,
    });

    // grab user balance if it exist
    const userBalance = await db.query.balances.findFirst({
      where: eq(balances.userId, session.user.id),
    });

    const amount =
      formData.type === "expense"
        ? -Number(formData.amount)
        : Number(formData.amount);

    if (userBalance) {
      await db
        .update(balances)
        .set({
          totalBalance: (userBalance.totalBalance as number) + amount,
        })
        .where(eq(balances.userId, session.user.id));
    } else {
      await db.insert(balances).values({
        userId: session.user.id,
        totalBalance: amount,
      });
    }

    // if it exist then update it
  } catch (e) {
    console.log(e);
    return "Something went wrong! Try again later...";
  }

  revalidatePath("/transactions");
}
