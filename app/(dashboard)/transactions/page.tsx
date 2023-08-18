import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import { db } from '@/db';
import { categories, Transaction, transactions } from '@/db/schema/finances';
import { authOptions } from '@/lib/auth/auth';
import { eq, like, sql } from 'drizzle-orm';
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
  | 'categoryId'
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
  userId: string
) {
  return await db.query.transactions.findMany({
    limit: limit,
    offset: offset,
    where: (transactions, { eq, and }) => {
      if (typeof name === 'string') {
        return and(
          like(transactions.name, `%${name}%`),
          eq(transactions.userId, userId)
        );
      } else {
        return eq(transactions.userId, userId);
      }
    },
    with: {
      category: true,
    },
    orderBy: (transactions, { asc, desc }) => {
      if (column && column in transactions) {
        if (order === 'asc') {
          return [asc(transactions[column])];
        } else {
          return [desc(transactions[column])];
        }
      } else {
        return [desc(transactions.id)];
      }
    },
  });
}

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
  const name = searchParams['name'];
  const sort = searchParams['sort'];

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
        columns={columns}
        data={transactions}
        count={transactionsCount}
      />
    </main>
  );
}
