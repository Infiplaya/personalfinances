'use server';

import { db } from '@/db';
import { profiles } from '@/db/schema/auth';
import { balances, transactions } from '@/db/schema/finances';
import { TransactionForm } from '@/lib/validation/transaction';
import { eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { convertCurrency, fetchExchangeRates } from '@/lib/utils';
import { getCurrentProfile } from '@/db/queries/auth';
import slugify from 'slugify';

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

    // grab user balance if it exist
    const userBalance = await db.query.balances.findFirst({
      where: eq(balances.profileId, currentProfile.id),
      orderBy: (balances, { desc }) => [desc(balances.timestamp)],
    });

    await db
      .update(profiles)
      .set({
        balance: userBalance
          ? (userBalance.totalBalance as number) + baseAmount
          : baseAmount,
      })
      .where(eq(profiles.id, currentProfile.id));

    await db.insert(balances).values({
      profileId: currentProfile.id,
      totalBalance: userBalance
        ? (userBalance.totalBalance as number) + baseAmount
        : baseAmount,
    });
    revalidatePath('/transactions');

    return { success: true, message: 'Succesfully added new transaction!' };
  } catch (e) {
    console.log(e);
    revalidatePath('/transactions');
    return { success: false, message: 'Something went wrong. Try Again!' };
  }
}

export async function updateTransaction(
  formData: TransactionForm,
  transactionId: number | undefined
) {
  if (!transactionId)
    return { success: false, message: 'Something Went Wrong!' };
  const currentProfile = await getCurrentProfile();
  const exchangeRates = await fetchExchangeRates();
  const baseAmount = convertCurrency(
    Number(formData.amount),
    formData.currencyCode,
    'USD',
    exchangeRates
  );

  try {
    await db
      .update(transactions)
      .set({
        ...formData,
        slug: slugify(formData.name),
        profileId: currentProfile.id,
        amount: Number(formData.amount),
        baseAmount: baseAmount,
      })
      .where(eq(transactions.id, transactionId));

    revalidatePath('/transactions');

    return { success: true, message: 'Successfully updated transaction!' };
  } catch (e) {
    console.log(e);
    return { success: false, message: 'Something Went Wrong!' };
  }
}

export async function deleteTransaction(transactionId: number) {
  try {
    await db.delete(transactions).where(eq(transactions.id, transactionId));
    revalidatePath('/transactions');
    return {
      success: true,
      error: 'Transaction deleted successfully!',
    };
  } catch (e) {
    return {
      success: false,
      error: 'Something went wrong. Try Again.',
    };
  }
}

export async function deleteTransactions(transactionsIds: number[]) {
  try {
    await db
      .delete(transactions)
      .where(inArray(transactions.id, transactionsIds));
    revalidatePath('/transactions');
    return {
      success: true,
      error: 'Transactions deleted successfully!',
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: 'Something went wrong. Try Again.',
    };
  }
}
