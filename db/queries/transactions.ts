'use server';

import { db } from '@/db';
import { balances, transactions } from '@/db/schema/finances';
import { and, asc, desc, eq, gte, inArray, like, lte, sql } from 'drizzle-orm';
import { overviewSchema } from '@/lib/validation/data';
import { UnwrapPromise } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';

export async function getOverviewData(userId: string) {
  const currentDate = new Date();
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - 7);

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
        eq(transactions.userId, userId)
      )
    )
    .groupBy(sql`weekday(${transactions.timestamp})`);

  return overviewSchema.parse(result);
}

export type OverviewData = UnwrapPromise<ReturnType<typeof getOverviewData>>;

export async function getBalanceData(userId: string) {
  const currentDate = new Date();
  let monthAgo = new Date(currentDate);
  monthAgo.setDate(currentDate.getDate() - 30);

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
        eq(balances.userId, userId)
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
  typesFilter: any,
  userId: string
) {
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

        eq(transactions.userId, userId),
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
  const session = await getServerSession(authOptions);
  if (!session) throw new Error();

  return await db
    .select()
    .from(transactions)
    .limit(6)
    .where(
      and(
        eq(transactions.userId, session.user.id),
        eq(sql`MONTH(${transactions.timestamp})`, month)
      )
    );
}

export async function countTransactions(userId: string) {
  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactions)
    .where(eq(transactions.userId, userId));

  return count[0].count;
}
