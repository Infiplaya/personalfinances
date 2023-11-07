'use server';

import { db } from '@/db';
import { balances, Currency, transactions } from '@/db/schema/finances';
import {
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  like,
  lte,
  ne,
  sql,
} from 'drizzle-orm';
import {
  findExchangeRate,
  getConversionRate,
  moneyFormat,
  UnwrapPromise,
} from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { cache } from 'react';
import { getCurrencies, getCurrentCurrency } from './currencies';
import { getCurrentProfile } from './auth';
import { profiles } from '../schema/auth';
import { getCategories } from './categories';
import { TimePeriod } from './targets';

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

export async function calculateOverviewData(
  preferredCurrency: string,
  overviewDays: number
) {
  const currentDate = new Date();
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - overviewDays);

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

export async function calculateBalanceData(
  preferredCurrency: string,
  balanceDays: number
) {
  const currentDate = new Date();
  const timestamp = new Date(currentDate);
  timestamp.setDate(currentDate.getDate() - balanceDays);

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
        gte(balances.timestamp, timestamp),
        lte(balances.timestamp, currentDate),
        eq(balances.profileId, currentProfile.id)
      )
    );
}

export const getBalanceData = cache(calculateBalanceData);

export type BalanceChartData = Awaited<ReturnType<typeof calculateBalanceData>>;

export async function calculateBalancesForUser(preferredCurrency: string) {
  const exchangeRate = await findExchangeRate('USD', preferredCurrency);
  const { user } = await validateSession();

  return await db
    .select({
      balance: sql<number>`ROUND(profiles.totalBalance * ${exchangeRate}, 2)`,
      name: profiles.name,
    })
    .from(profiles)
    .limit(5)
    .where(eq(profiles.userId, user.id));
}

export const getBalancesForUser = cache(calculateBalancesForUser);

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

type FilterType = 'expense' | 'income';

export async function selectTransactions(
  limit: number,
  page: number,
  name: string | string[] | undefined,
  column: Column,
  order: Order,
  categoriesFilter: string[],
  typesFilter: FilterType[]
) {
  const currentProfile = await getCurrentProfile();
  const offset = (page - 1) * limit;
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

async function selectIncomesOrExpenses(type: 'expense' | 'income') {
  const currentProfile = await getCurrentProfile();
  return await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.profileId, currentProfile.id),
        eq(transactions.type, type === 'expense' ? 'expense' : 'income')
      )
    );
}

export const getIncomesOrExpenses = cache(selectIncomesOrExpenses);

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
      totalBalance: sql<number>`sum(CASE WHEN transactions.type = 'income' THEN transactions.baseAmount * ${exchangeRate} ELSE 0 END) - sum(CASE WHEN transactions.type = 'expense' THEN transactions.baseAmount *  ${exchangeRate} ELSE 0 END)`,
    })
    .from(transactions)
    .where(and(eq(transactions.profileId, currentProfile.id)))
    .groupBy(sql`MONTH(${transactions.timestamp})`);
}

export const getSummariesForMonths = cache(calculateSummariesForMonths);

export async function countTransactions(
  name: string | string[] | undefined,
  categoriesFilter: string[],
  typesFilter: FilterType[]
) {
  const currentProfile = await getCurrentProfile();
  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactions)
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
    );

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
    limit: 8,
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
      totalAmount: sql<number>`sum(transactions.baseAmount * ${conversionRate})`,
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

async function selectSimilarTransactions(
  name: string,
  type: 'income' | 'expense',
  category: string
) {
  const currentProfile = await getCurrentProfile();

  return await db.query.transactions.findMany({
    limit: 4,
    orderBy: (transactions, { desc }) => [desc(transactions.timestamp)],
    where: (transactions, { eq, and }) =>
      and(
        eq(transactions.profileId, currentProfile.id),
        ne(transactions.name, name),
        eq(transactions.type, type) || eq(transactions.categoryName, category)
      ),
  });
}

export const getSimilarTransactions = cache(selectSimilarTransactions);

export async function getTransactionFormData() {
  const categoriesData = getCategories();
  const currenciesData = getCurrencies();
  const currentCurrencyData = getCurrentCurrency();

  const [categories, currencies, currentCurrency] = await Promise.all([
    categoriesData,
    currenciesData,
    currentCurrencyData,
  ]);

  return { categories, currencies, currentCurrency };
}

export async function getTransaction(slug: string) {
  const currentProfile = await getCurrentProfile();

  return await db.query.transactions.findFirst({
    where: and(
      eq(transactions.slug, slug),
      eq(transactions.profileId, currentProfile.id)
    ),
    with: {
      category: true,
    },
  });
}

async function sumIncomeForTime(
  timePeriod: TimePeriod,
  currency: Currency['code']
) {
  const currentProfile = await getCurrentProfile();

  const conversionRate = getConversionRate(currency);

  const { startDate, endDate } = calculateTimePeriodDates(timePeriod);

  const res = await db
    .select({
      totalIncome: sql<number>`sum(CASE WHEN transactions.type = 'income' THEN transactions.baseAmount * ${conversionRate} ELSE 0 END)`,
    })
    .from(transactions)
    .where(
      and(
        gte(transactions.timestamp, startDate),
        lte(transactions.timestamp, endDate),
        eq(transactions.profileId, currentProfile.id)
      )
    );

  return res[0].totalIncome;
}

export const getExpenseForTime = cache(sumExpenseForTime);

async function sumExpenseForTime(
  timePeriod: TimePeriod,
  currency: Currency['code']
) {
  const currentProfile = await getCurrentProfile();

  const conversionRate = getConversionRate(currency);

  const { startDate, endDate } = calculateTimePeriodDates(timePeriod);

  const res = await db
    .select({
      totalIncome: sql<number>`sum(CASE WHEN transactions.type = 'expense' THEN transactions.baseAmount * ${conversionRate} ELSE 0 END)`,
    })
    .from(transactions)
    .where(
      and(
        gte(transactions.timestamp, startDate),
        lte(transactions.timestamp, endDate),
        eq(transactions.profileId, currentProfile.id)
      )
    );

  return res[0].totalIncome;
}

export const getIncomeForTime = cache(sumIncomeForTime);

function calculateTimePeriodDates(timePeriod: TimePeriod) {
  const currentDate = new Date();

  if (timePeriod === 'day') {
    const startDate = new Date(currentDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(currentDate);
    endDate.setHours(23, 59, 59, 999);
    return { startDate, endDate };
  } else if (timePeriod === 'month') {
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
      0,
      0,
      0,
      0
    );
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
    return { startDate, endDate };
  } else if (timePeriod === 'year') {
    const startDate = new Date(currentDate.getFullYear(), 0, 1, 0, 0, 0, 0);
    const endDate = new Date(
      currentDate.getFullYear(),
      11,
      31,
      23,
      59,
      59,
      999
    );
    return { startDate, endDate };
  } else {
    // Handle unsupported timePeriod
    throw new Error('Unsupported timePeriod');
  }
}
