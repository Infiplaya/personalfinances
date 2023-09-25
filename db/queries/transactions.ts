'use server';

import { db } from '@/db';
import { balances, transactions } from '@/db/schema/finances';
import { and, asc, desc, eq, gte, inArray, like, lte, sql } from 'drizzle-orm';
import {
  convertCurrency,
  fetchExchangeRates,
  findExchangeRate,
  UnwrapPromise,
} from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { cache } from 'react';
import { getCurrentCurrency } from './currencies';
import { getCurrentProfile } from './auth';

export async function validateSession() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('User not authenticated');
  return session;
}

export async function selectAllTransactionsIds() {
  return await db
    .select({
      id: transactions.id,
    })
    .from(transactions);
}

export const getAllTransactionsIds = cache(selectAllTransactionsIds);

export async function calculateOverviewData(preferredCurrency: string) {
  const currentDate = new Date();
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - 7);

  const currentProfile = await getCurrentProfile();

  const exchangeRates = await fetchExchangeRates();

  const result = await db
    .select({
      day: sql<number>`weekday(${transactions.timestamp})`,
      transactionAmount: sql<number>`transactions.amount`,
      currency: sql<string>`transactions.currencyCode`,
      transactionType: sql<string>`transactions.type`,
    })
    .from(transactions)
    .where(
      and(
        gte(transactions.timestamp, sevenDaysAgo),
        lte(transactions.timestamp, currentDate),
        eq(transactions.profileId, currentProfile.id)
      )
    );

  const convertedResult = result.map((row) => ({
    day: row.day,
    transactionAmount: convertCurrency(
      Number(row.transactionAmount),
      row.currency,
      preferredCurrency,
      exchangeRates
    ),
    transactionType: row.transactionType,
  }));

  const dailyTotals: {
    day: number;
    totalIncome: number;
    totalExpenses: number;
  }[] = [];

  convertedResult.forEach((row) => {
    const day = row.day;
    const existingTotal = dailyTotals.find((item) => item.day === day);

    if (!existingTotal) {
      dailyTotals.push({
        day,
        totalIncome:
          row.transactionType === 'income' ? row.transactionAmount : 0,
        totalExpenses:
          row.transactionType === 'expense' ? row.transactionAmount : 0,
      });
    } else {
      if (row.transactionType === 'income') {
        existingTotal.totalIncome += row.transactionAmount;
      } else if (row.transactionType === 'expense') {
        existingTotal.totalExpenses += row.transactionAmount;
      }
    }
  });

  return dailyTotals;
}

export type OverviewData = UnwrapPromise<
  ReturnType<typeof calculateOverviewData>
>;

export const getOverviewData = cache(calculateOverviewData);

export async function calculateBalanceData(preferredCurrency: string) {
  const currentDate = new Date();
  let monthAgo = new Date(currentDate);
  monthAgo.setDate(currentDate.getDate() - 30);

  const exchangeRate = await findExchangeRate('USD', preferredCurrency);

  const currentProfile = await getCurrentProfile();

  const session = await validateSession();
  return await db
    .select({
      totalBalance: sql<number>`ROUND(${balances.totalBalance} * ${exchangeRate}, 2)`,
      date: sql<string>`date(${balances.timestamp})`,
    })
    .from(balances)
    .where(
      and(
        gte(balances.timestamp, monthAgo),
        lte(balances.timestamp, currentDate),
        eq(balances.profileId, currentProfile.id)
      )
    );
}

export const getBalanceData = cache(calculateBalanceData);

type Order = 'asc' | 'desc' | undefined;

type Column =
  | 'id'
  | 'name'
  | 'description'
  | 'amount'
  | 'profileId'
  | 'categoryName'
  | 'type'
  | 'timestamp'
  | 'currencyCode'
  | undefined;

export async function selectTransactions(
  limit: number,
  offset: number,
  name: string | string[] | undefined,
  column: Column,
  order: Order,
  categoriesFilter: string[],
  typesFilter: any
) {
  const currentProfile = await getCurrentProfile();
  return await db
    .select()
    .from(transactions)
    .limit(limit)
    .offset(offset)
    .where(
      and(
        typeof name === 'string'
          ? like(transactions.name, `%${name}%`)
          : undefined,

        eq(transactions.profileId, currentProfile.id),
        categoriesFilter.length > 0
          ? inArray(transactions.categoryName, categoriesFilter)
          : undefined,
        typesFilter.length > 0
          ? inArray(transactions.type, typesFilter)
          : undefined
      )
    )
    .orderBy(
      column && column in transactions
        ? order === 'asc'
          ? asc(transactions[column])
          : desc(transactions[column])
        : desc(transactions.id)
    );
}

export const getTransactions = cache(selectTransactions);

export async function selectTransactionsByMonth(month: number) {
  const currentProfile = await getCurrentProfile();
  return await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.profileId, currentProfile.id),
        eq(sql`MONTH(${transactions.timestamp})`, month)
      )
    );
}

export const getTransactionsByMonth = cache(selectTransactionsByMonth);

export async function calculateSummariesForMonths() {
  const prefferedCurrency = await getCurrentCurrency();
  const exchangeRates = await fetchExchangeRates();
  const currentProfile = await getCurrentProfile();
  const result = await db
    .select({
      month: sql<number>`MONTH(${transactions.timestamp})`,
      currency: transactions.currencyCode,
      amount: transactions.amount,
      transactionType: transactions.type,
    })
    .from(transactions)
    .where(and(eq(transactions.profileId, currentProfile.id)));

  const convertedResult = result.map((row) => ({
    month: row.month,
    transactionAmount: convertCurrency(
      Number(row.amount),
      row.currency,
      prefferedCurrency,
      exchangeRates
    ),
    transactionType: row.transactionType,
  }));

  let monthsSummaries: {
    month: number;
    totalIncomes: number;
    totalExpenses: number;
    totalBalance: number;
  }[] = [];

  convertedResult.forEach((row) => {
    const month = row.month;
    const existingTotal = monthsSummaries.find((item) => item.month === month);

    if (!existingTotal) {
      monthsSummaries.push({
        month,
        totalIncomes:
          row.transactionType === 'income' ? row.transactionAmount : 0,
        totalExpenses:
          row.transactionType === 'expense' ? row.transactionAmount : 0,
        totalBalance: 0,
      });
    } else {
      if (row.transactionType === 'income') {
        existingTotal.totalIncomes += row.transactionAmount;
      } else if (row.transactionType === 'expense') {
        existingTotal.totalExpenses += row.transactionAmount;
      }
    }
  });

  monthsSummaries = monthsSummaries.map(
    (month) =>
      (month = {
        ...month,
        totalBalance: month.totalIncomes - month.totalExpenses,
      })
  );

  return monthsSummaries;
}

export const getSummariesForMonths = cache(calculateSummariesForMonths);

export async function countTransactions() {
  const currentProfile = await getCurrentProfile();
  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactions)
    .where(eq(transactions.profileId, currentProfile.id));

  return count[0].count;
}

export const getTransactionsCount = cache(countTransactions);

async function calculateTotalIncomeAndExpenses(
  prefferedCurrency: string,
  month?: number
) {
  const exchangeRates = await fetchExchangeRates();

  const currentMonth = month ? month + 1 : null;

  const currentProfile = await getCurrentProfile();

  const result = await db
    .select({
      transactionAmount: sql<number>`transactions.amount`,
      currency: sql<string>`transactions.currencyCode`,
      transactionType: sql<string>`transactions.type`,
    })
    .from(transactions)
    .where(
      month
        ? and(
            eq(sql`MONTH(${transactions.timestamp})`, currentMonth),
            eq(transactions.profileId, currentProfile.id)
          )
        : eq(transactions.profileId, currentProfile.id)
    );

  const convertedResult = result.map((row) => ({
    month: currentMonth,
    transactionAmount: convertCurrency(
      Number(row.transactionAmount),
      row.currency,
      prefferedCurrency,
      exchangeRates
    ),
    transactionType: row.transactionType,
  }));

  let totalIncomes = 0;
  let totalExpenses = 0;

  convertedResult.forEach((transaction) => {
    if (transaction.transactionType === 'income') {
      totalIncomes += transaction.transactionAmount;
    } else if (transaction.transactionType === 'expense') {
      totalExpenses += transaction.transactionAmount;
    }
  });

  const totalBalance = totalIncomes - totalExpenses;

  const summaryObject = {
    totalIncomes,
    totalExpenses,
    totalBalance,
    month: currentMonth,
  };

  return summaryObject;
}

export const getTotalIncomeAndExpenses = cache(calculateTotalIncomeAndExpenses);

async function selectRecentTransactions() {
  const currentProfile = await getCurrentProfile();

  return await db.query.transactions.findMany({
    limit: 6,
    orderBy: (transactions, { desc }) => [desc(transactions.timestamp)],
    with: {
      category: true,
    },
    where: (transactions, { eq }) =>
      eq(transactions.profileId, currentProfile.id),
  });
}

export const getRecentTransactions = cache(selectRecentTransactions);
