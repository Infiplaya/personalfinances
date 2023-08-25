'use server';

import { db } from '@/db';
import { balances, transactions } from '@/db/schema/finances';
import { and, asc, desc, eq, gte, inArray, like, lte, sql } from 'drizzle-orm';
import { overviewSchema } from '@/lib/validation/data';
import { UnwrapPromise } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';

async function validateSession() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('User not authenticated');
  return session;
}

export async function getAllTransactionsIds() {
  return await db
    .select({
      id: transactions.id,
    })
    .from(transactions)
}

export async function getOverviewData() {
  const currentDate = new Date();
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - 7);

  const session = await validateSession();
  const result = await db
    .select({
      day: sql<number>`weekday(${transactions.timestamp})`,
      totalIncome: sql<number>`sum(CASE WHEN transactions.type = 'income' THEN transactions.amount ELSE 0 END)`,
      totalExpenses: sql<number>`sum(CASE WHEN transactions.type = 'expense' THEN transactions.amount ELSE 0 END)`,
    })
    .from(transactions)
    .where(
      and(
        gte(transactions.timestamp, sevenDaysAgo),
        lte(transactions.timestamp, currentDate),
        eq(transactions.userId, session.user.id)
      )
    )
    .groupBy(sql`weekday(${transactions.timestamp})`);

  return overviewSchema.parse(result);
}

export type OverviewData = UnwrapPromise<ReturnType<typeof getOverviewData>>;

export async function getBalanceData() {
  const currentDate = new Date();
  let monthAgo = new Date(currentDate);
  monthAgo.setDate(currentDate.getDate() - 30);

  const session = await validateSession();
  return await db
    .select({
      totalBalance: sql<number>`${balances.totalBalance}`,
      date: sql<string>`date(${balances.timestamp})`,
    })
    .from(balances)
    .where(
      and(
        gte(balances.timestamp, monthAgo),
        lte(balances.timestamp, currentDate),
        eq(balances.userId, session.user.id)
      )
    );
}

type Order = 'asc' | 'desc' | undefined;

type Column =
  | 'id'
  | 'name'
  | 'description'
  | 'amount'
  | 'userId'
  | 'categoryName'
  | 'type'
  | 'timestamp'
  | undefined;

export async function getTransactions(
  limit: number,
  offset: number,
  name: string | string[] | undefined,
  column: Column,
  order: Order,
  categoriesFilter: string[],
  typesFilter: any
) {
  const session = await validateSession();
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

        eq(transactions.userId, session.user.id),
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

export async function getTransactionsByMonth(month: number) {
  const session = await validateSession();
  return await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, session.user.id),
        eq(sql`MONTH(${transactions.timestamp})`, month)
      )
    );
}

export async function getSummariesForMonths() {
  const session = await validateSession();
  return await db
    .select({
      month: sql<number>`MONTH(${transactions.timestamp})`,
      totalIncome: sql<string>`sum(CASE WHEN transactions.type = 'income' THEN transactions.amount ELSE 0 END)`,
      totalExpenses: sql<string>`sum(CASE WHEN transactions.type = 'expense' THEN transactions.amount ELSE 0 END)`,
      totalBalance: sql<string>`sum(CASE WHEN transactions.type = 'income' THEN transactions.amount ELSE 0 END) - sum(CASE WHEN transactions.type = 'expense' THEN transactions.amount ELSE 0 END)`,
    })
    .from(transactions)
    .where(and(eq(transactions.userId, session.user.id)))
    .groupBy(sql`MONTH(${transactions.timestamp})`);
}

export async function countTransactions() {
  const session = await validateSession();
  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactions)
    .where(eq(transactions.userId, session.user.id));

  return count[0].count;
}

export async function getBalanceForMonth(month?: number) {
  const currentDate = new Date();
  const currentMonth = month ? month + 1 : currentDate.getMonth() + 1;

  const session = await validateSession();
  const result = await db
    .select({
      totalIncome: sql<string>`sum(CASE WHEN transactions.type = 'income' THEN transactions.amount ELSE 0 END)`,
      totalExpenses: sql<string>`sum(CASE WHEN transactions.type = 'expense' THEN transactions.amount ELSE 0 END)`,
      totalBalance: sql<string>`sum(CASE WHEN transactions.type = 'income' THEN transactions.amount ELSE 0 END) - sum(CASE WHEN transactions.type = 'expense' THEN transactions.amount ELSE 0 END)`,
    })
    .from(transactions)
    .where(
      and(
        eq(sql`MONTH(${transactions.timestamp})`, currentMonth),
        eq(transactions.userId, session.user.id)
      )
    );

  return {
    month: month || new Date().getMonth() + 1,
    totalExpenses: result[0].totalExpenses,
    totalIncome: result[0].totalIncome,
    totalBalance: result[0].totalBalance,
  };
}
