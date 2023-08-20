import { TransactionDrawer } from '@/components/drawer';
import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import { getCategories } from '@/db/queries/categories';

import { countTransactions, getTransactions } from '@/db/queries/transactions';
import { Transaction } from '@/db/schema/finances';
import { authOptions } from '@/lib/auth/auth';
import { getServerSession } from 'next-auth';
import { columns } from './columns';
import { DataTable } from './data-table';

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
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

  const categoriesData = await getCategories();

  return (
    <main className="mx-auto py-10">
      <div className="flex w-full justify-end px-3 lg:my-6">
        <TransactionDialog categories={categoriesData} />
        <div className="lg:hidden">
          <TransactionDrawer categories={categoriesData} />
        </div>
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
