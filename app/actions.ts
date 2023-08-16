"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema/finances";
import { authOptions } from "@/lib/auth/auth";
import { TransactionForm } from "@/lib/validation/transaction";
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
  } catch (e) {
    console.log(e);
    return "Something went wrong! Try again later...";
  }

  revalidatePath("/transactions");
}
