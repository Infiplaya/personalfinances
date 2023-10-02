'use server';

import { db } from '@/db';
import { balances, transactions } from '@/db/schema/finances';
import { and, asc, desc, eq, gte, inArray, like, lte, sql } from 'drizzle-orm';
import {
  findExchangeRate,
  getConversionRate,
  moneyFormat,
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

export async function selectAllTransactionsSlugs() {
  return await db
    .select({
      slug: transactions.slug,
    })
    .from(transactions);
}

export const getAllTransactionsSlugs = cache(selectAllTransactionsSlugs);

export async function calculateOverviewData(preferredCurrency: string) {
  const currentDate = new Date();
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - 7);

  const currentProfile = await getCurrentProfile();

  const conversionRate = getConversionRate(preferredCurrency);

  return await db
    .select({
      date: sql<number>`DATE(${transactions.timestamp})`,
      totalIncome: sql<number>`sum(CASE WHEN transactions.type = 'income' THEN transactions.baseAmount * ${conversionRate} ELSE 0 END)`,
      totalExpenses: sql<number>`sum(CASE WHEN transactions.type = 'expense' THEN transactions.baseAmount * ${conversionRate} ELSE 0 END)`,
    })
    .from(transactions)
    .where(
      and(
        gte(transactions.timestamp, sevenDaysAgo),
        lte(transactions.timestamp, currentDate),
        eq(transactions.profileId, currentProfile.id)
      )
    )
    .groupBy(sql`DATE(${transactions.timestamp})`);
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
  | 'baseAmount'
  | 'profileId'
  | 'categoryName'
  | 'type'
  | 'timestamp'
  | 'currencyCode'
  | 'slug'
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
  const currentProfile = await getCurrentProfile();
  const exchangeRate = getConversionRate(prefferedCurrency);
  return await db
    .select({
      month: sql<number>`MONTH(${transactions.timestamp})`,
      totalIncomes: sql<number>`sum(CASE WHEN transactions.type = 'income' THEN transactions.baseAmount * ${exchangeRate} ELSE 0 END)`,
      totalExpenses: sql<number>`sum(CASE WHEN transactions.type = 'expense' THEN transactions.baseAmount * ${exchangeRate} ELSE 0 END)`,
      totalBalance: sql<number>`sum(CASE WHEN transactions.type = 'income' THEN transactions.baseAmount ELSE 0 END) - sum(CASE WHEN transactions.type = 'expense' THEN transactions.amount ELSE 0 END) *  ${exchangeRate}`,
    })
    .from(transactions)
    .where(and(eq(transactions.profileId, currentProfile.id)))
    .groupBy(sql`MONTH(${transactions.timestamp})`);
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
  const currentMonth = month ? month + 1 : null;

  const currentProfile = await getCurrentProfile();

  const conversionRate = getConversionRate(prefferedCurrency);

  const result = await db
    .select({
      totalIncome: sql<number>`sum(CASE WHEN transactions.type = 'income' THEN transactions.baseAmount * ${conversionRate} ELSE 0 END)`,
      totalExpenses: sql<number>`sum(CASE WHEN transactions.type = 'expense' THEN transactions.baseAmount * ${conversionRate} ELSE 0 END)`,
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

  return {
    totalExpenses: result[0].totalExpenses,
    totalIncomes: result[0].totalIncome,
    totalBalance: result[0].totalIncome - result[0].totalExpenses,
    month: currentMonth,
  };
}
export const getTotalIncomeAndExpenses = cache(calculateTotalIncomeAndExpenses);

async function selectRecentTransactions() {
  const currentProfile = await getCurrentProfile();

  return await db.query.transactions.findMany({
    limit: 7,
    orderBy: (transactions, { desc }) => [desc(transactions.timestamp)],
    with: {
      category: true,
    },
    where: (transactions, { eq }) =>
      eq(transactions.profileId, currentProfile.id),
  });
}

export const getRecentTransactions = cache(selectRecentTransactions);

type TransactionsWithCategory = UnwrapPromise<
  ReturnType<typeof selectRecentTransactions>
>;
export type TransactionWithCategory = TransactionsWithCategory[number];

export async function calculateTotalForCategory(
  categoryName: string,
  thisMonth?: boolean
) {
  const preferredCurrency = await getCurrentCurrency();

  const month = thisMonth ? new Date().getMonth() + 1 : null;

  const currentProfile = await getCurrentProfile();

  const conversionRate = getConversionRate(preferredCurrency);

  const totalAmountQuery = await db
    .select({
      totalAmount: sql<number>`sum(CASE WHEN transactions.type = 'income' THEN transactions.baseAmount * ${conversionRate} ELSE 0 END)`,
    })
    .from(transactions)
    .where(
      month
        ? and(
            eq(sql`MONTH(${transactions.timestamp})`, month),
            eq(transactions.profileId, currentProfile.id),
            eq(transactions.categoryName, categoryName)
          )
        : and(
            eq(transactions.profileId, currentProfile.id),
            eq(transactions.categoryName, categoryName)
          )
    );

  return {
    totalAmount: moneyFormat(
      totalAmountQuery[0].totalAmount,
      preferredCurrency
    ),
  };
}
