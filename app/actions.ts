'use server';

import { db } from '@/db';
import { users } from '@/db/schema/auth';
import { balances, transactions } from '@/db/schema/finances';
import { authOptions } from '@/lib/auth/auth';
import { TransactionForm } from '@/lib/validation/transaction';
import { eq, InferModel } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { hash } from 'bcryptjs';
import { RegisterForm } from '@/lib/validation/auth';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export async function registerUser(formData: RegisterForm) {
  try {
    const hashed_password = await hash(formData.password, 12);

    type NewUser = InferModel<typeof users, 'insert'>;
    const insertUser = async (user: NewUser) => {
      return db.insert(users).values(user);
    };

    const newUser: NewUser = {
      id: uuidv4(),
      name: formData.name,
      password: hashed_password,
      email: formData.email.toLowerCase(),
    };
    await insertUser(newUser);

    return {
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    };
  } catch (e: any) {
    console.log(e);
    return {
      error: e.message,
    };
  }
}

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
      formData.type === 'expense'
        ? -Number(formData.amount)
        : Number(formData.amount);

    await db.insert(balances).values({
      userId: session.user.id,
      totalBalance: userBalance
        ? (userBalance.totalBalance as number) + amount
        : amount,
    });

    // if it exist then update it
  } catch (e) {
    console.log(e);
    return 'Something went wrong! Try again later...';
  }

  revalidatePath('/transactions');
}

export async function deleteTransaction(transactionId: number) {
  try {
    await db
      .delete(transactions)
      .where(eq(transactions.id, transactionId));
    revalidatePath('/transactions');
  } catch (e) {
    console.log(e);
  }
}
