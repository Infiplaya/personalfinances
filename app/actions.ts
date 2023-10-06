'use server';

import { db } from '@/db';
import { profiles, users } from '@/db/schema/auth';
import { balances, transactions } from '@/db/schema/finances';
import { TransactionForm } from '@/lib/validation/transaction';
import { eq, inArray, InferModel } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { hash } from 'bcryptjs';
import { ProfileForm, RegisterForm } from '@/lib/validation/auth';
import { v4 as uuidv4 } from 'uuid';
import { convertCurrency, fetchExchangeRates } from '@/lib/utils';
import { getCurrentProfile } from '@/db/queries/auth';
import { validateSession } from '@/db/queries/transactions';
import slugify from 'slugify';
import { z } from 'zod';

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
      success: true,
      message: 'Registration completed successfully',
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    };
  } catch (e: any) {
    console.log(e);
    return {
      success: false,
      error: e.message,
    };
  }
}

export async function createNewTransaction(formData: TransactionForm) {
  const currentProfile = await getCurrentProfile();
  const exchangeRates = await fetchExchangeRates();
  const baseAmount = convertCurrency(
    Number(formData.amount),
    formData.currencyCode,
    'USD',
    exchangeRates
  );

  try {
    await db.insert(transactions).values({
      ...formData,
      slug: slugify(formData.name),
      profileId: currentProfile.id,
      amount: Number(formData.amount),
      baseAmount: baseAmount,
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
    revalidatePath('/transactions');

    return { success: true, message: 'Succesfully added new transaction!' };
  } catch (e) {
    console.log(e);
    revalidatePath('/transactions');
    return { success: false, message: 'Something went wrong. Try Again!' };
  }
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

const currencySchema = z.object({
  code: z.string().nonempty(),
});

export async function changeCurrency(prevState: any, formData: FormData) {
  const currentProfile = await getCurrentProfile();
  const data = currencySchema.parse({
    code: formData.get('code'),
  });

  try {
    await db
      .update(profiles)
      .set({
        currencyCode: data.code,
      })
      .where(eq(profiles.id, currentProfile.id));

    revalidatePath('/');
    return { message: `Changed currency to ${data.code}` };
  } catch (e) {
    console.log(e);
  }
}

export async function createNewProfile(formData: ProfileForm) {
  const session = await validateSession();

  try {
    await db.insert(profiles).values({
      id: uuidv4(),
      ...formData,
      userId: session.user.id,
    });
    revalidatePath('/');
    return { success: true, message: 'Success!' };
  } catch (e) {
    return { success: false, message: 'Something went wrong... Try Again' };
  }
}

export async function updateUserProfile(
  formData: ProfileForm,
  profileId: string | undefined
) {
  const currentProfile = await getCurrentProfile();

  const { user } = await validateSession();

  try {
    await db
      .update(profiles)
      .set({
        name: formData.name,
        currencyCode: formData.currencyCode,
      })
      .where(eq(profiles.id, profileId ? profileId : currentProfile.id));

    await db
      .update(users)
      .set({
        currentProfile: formData.name,
      })
      .where(eq(users.id, user.id));

    revalidatePath('/');

    return { success: true, message: 'Success!' };
  } catch (e) {
    console.log(e);
    return { success: false, message: 'Something Went Wrong!' };
  }
}

const profileSchema = z.object({
  name: z.string().nonempty(),
});

export async function changeCurrentProfile(prevState: any, formData: FormData) {
  const { user } = await validateSession();

  const data = profileSchema.parse({
    name: formData.get('name'),
  });

  try {
    await db
      .update(users)
      .set({
        currentProfile: data.name,
      })
      .where(eq(users.id, user.id));

    revalidatePath('/');
    return { success: true, message: `Changed profile to ${data.name}` };
  } catch (e) {
    console.log(e);
    return 'Something went wrong! Try again later...';
  }
}

export async function deleteProfile(profileId: string, formData: FormData) {
  const { user } = await validateSession();

  try {
    await db.delete(profiles).where(eq(profiles.id, profileId));
    await db
      .update(users)
      .set({
        currentProfile: 'default',
      })
      .where(eq(users.id, user.id));
  } catch (e) {
    console.log(e);
    return 'Something went wrong! Try again later...';
  }

  revalidatePath('/');
}
