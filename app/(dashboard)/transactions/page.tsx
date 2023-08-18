import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import { db } from '@/db';
import { categories, Transaction, transactions } from '@/db/schema/finances';
import { authOptions } from '@/lib/auth/auth';
import { UnwrapPromise } from '@/lib/utils';
import {
  and,
  asc,
  desc,
  eq,
  inArray,
  InferModel,
  like,
  sql,
} from 'drizzle-orm';
import { L } from 'drizzle-orm/select.types.d-7da7fae0';
import { getServerSession } from 'next-auth';
import { columns } from './columns';
import { DataTable } from './data-table';

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

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
type Order = 'asc' | 'desc' | undefined;


async function getTransactions(
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

export type TransactionWithCategory = UnwrapPromise<
  ReturnType<typeof getTransactions>
>[number];

async function countTransactions(userId: string) {
  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactions)
    .where(eq(transactions.userId, userId));

  return count[0].count;
}

export default async function TransactionsPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);

  const page = searchParams['page'] ?? '1';
  const per_page = searchParams['per_page'] ?? '10';
  const { sort, name, category, type } = searchParams;

  const categoriesFilter =
    typeof category === 'string'
      ? (category.toLowerCase().split('.') as Transaction['categoryName'][])
      : [];

  const typesFilter =
    typeof type === 'string'
      ? (type.toLowerCase().split('.') as Transaction['type'][])
      : [];

  const limit = typeof per_page === 'string' ? Number(per_page) : 1;
  const offset =
    typeof page === 'string'
      ? Number(page) > 0
        ? (Number(page) - 1) * limit
        : 0
      : 0;

  const [column, order] =
    typeof sort === 'string'
      ? (sort.split('.') as [
          keyof Transaction | undefined,
          'asc' | 'desc' | undefined,
        ])
      : [];

  const transactions = await getTransactions(
    limit,
    offset,
    name,
    column,
    order,
    categoriesFilter,
    typesFilter,
    session?.user.id as string
  );

  const transactionsCount = await countTransactions(session?.user.id as string);

  const categoriesData = await db.select().from(categories);

  return (
    <main className="mx-auto py-10">
      <div className="my-6 flex w-full justify-end">
        <TransactionDialog categories={categoriesData} />
      </div>
      <DataTable
        categories={categoriesData}
        columns={columns}
        data={transactions}
        count={transactionsCount}
      />
    </main>
  );
}
