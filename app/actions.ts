'use server';

import { db } from '@/db';
import { profiles, users } from '@/db/schema/auth';
import { balances, transactions } from '@/db/schema/finances';
import { TransactionForm } from '@/lib/validation/transaction';
import { eq, inArray, InferModel } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { hash } from 'bcryptjs';
import { NewProfileForm, RegisterForm } from '@/lib/validation/auth';
import { v4 as uuidv4 } from 'uuid';
import { convertCurrency, fetchExchangeRates } from '@/lib/utils';
import { getCurrentProfile } from '@/db/queries/auth';
import { validateSession } from '@/db/queries/transactions';
import slugify from 'slugify';

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
      currentProfile: 'default',
      email: formData.email.toLowerCase(),
    };
    await insertUser(newUser);

    type NewProfile = InferModel<typeof profiles, 'insert'>;
    const insertProfile = async (profile: NewProfile) => {
      return db.insert(profiles).values(profile);
    };

    const newProfile: NewProfile = {
      id: uuidv4(),
      name: 'default',
      currencyCode: 'USD',
      userId: newUser.id,
    };
    await insertProfile(newProfile);

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
  const currentProfile = await getCurrentProfile();
  try {
    await db.insert(transactions).values({
      ...formData,
      slug: slugify(formData.name),
      profileId: currentProfile.id,
    });

    const exchangeRates = await fetchExchangeRates();

    // grab user balance if it exist
    const userBalance = await db.query.balances.findFirst({
      where: eq(balances.profileId, currentProfile.id),
      orderBy: (balances, { desc }) => [desc(balances.timestamp)],
    });

    let amount =
      formData.type === 'expense'
        ? -Number(formData.amount)
        : Number(formData.amount);

    amount = convertCurrency(
      amount,
      formData.currencyCode,
      'USD',
      exchangeRates
    );

    await db.insert(balances).values({
      profileId: currentProfile.id,
      totalBalance: userBalance
        ? (userBalance.totalBalance as number) + amount
        : amount,
    });
  } catch (e) {
    console.log(e);
    return 'Something went wrong! Try again later...';
  }

  revalidatePath('/transactions');
}

export async function deleteTransaction(transactionId: number) {
  try {
    await db.delete(transactions).where(eq(transactions.id, transactionId));
    revalidatePath('/transactions');
  } catch (e) {
    console.log(e);
  }
}

export async function deleteTransactions(transactionsIds: number[]) {
  try {
    await db
      .delete(transactions)
      .where(inArray(transactions.id, transactionsIds));
    revalidatePath('/transactions');
  } catch (e) {
    console.log(e);
  }
}

export async function changePrefferedCurrency(currencyCode: string) {
  const currentProfile = await getCurrentProfile();
  try {
    await db
      .update(profiles)
      .set({
        currencyCode: currencyCode,
      })
      .where(eq(profiles.id, currentProfile.id));

    revalidatePath('/');
  } catch (e) {
    console.log(e);
  }
}

export async function createNewProfile(formData: NewProfileForm) {
  const session = await validateSession();
  try {
    await db.insert(profiles).values({
      id: uuidv4(),
      ...formData,
      userId: session.user.id,
    });
  } catch (e) {
    console.log(e);
    return 'Something went wrong! Try again later...';
  }

  revalidatePath('/');
}

export async function changeCurrentProfile(newCurrentProfile: string) {
  const session = await validateSession();
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id));

  try {
    await db
      .update(users)
      .set({
        currentProfile: newCurrentProfile,
      })
      .where(eq(users.id, session.user.id));

    console.log(user);
  } catch (e) {
    console.log(e);
    return 'Something went wrong! Try again later...';
  }

  revalidatePath('/');
}
