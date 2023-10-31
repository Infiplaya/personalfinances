import {
  getTransactionFormData,
  getTransactionsCount,
} from '@/db/queries/transactions';
import { Transaction } from '@/db/schema/finances';
import { RowsControls } from '@/components/data-table/data-table-rows';
import { Metadata } from 'next';
import Pagination from '@/components/data-table/pagination';
import { Suspense } from 'react';
import TableSkeleton from '@/components/skeletons/table-skeleton';
import { Transactions } from './transactions';
import { TransactionModal } from '@/components/transactions/transaction-modal';
import SearchTransactions from '@/components/data-table/search-transactions';

export const metadata: Metadata = {
  title: 'Transactions',
  description: 'Page with your transactions',
};

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}
export default async function TransactionsPage({ searchParams }: Props) {
  const { categories, currencies, currentCurrency } =
    await getTransactionFormData();

  const page =
    typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const limit =
    typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 10;
  const { sort, name, category, type } = searchParams;

  const categoriesFilter =
    typeof category === 'string'
      ? (category.toLowerCase().split('.') as Transaction['categoryName'][])
      : [];

  const typesFilter =
    typeof type === 'string'
      ? (type.toLowerCase().split('.') as Transaction['type'][])
      : [];

  const [column, order] =
    typeof sort === 'string'
      ? (sort.split('.') as [
          keyof Transaction | undefined,
          'asc' | 'desc' | undefined,
        ])
      : [];

  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit);
  const totalTransactions = await getTransactionsCount(
    name,
    categoriesFilter,
    typesFilter
  );
  const lastPage = Math.ceil(totalTransactions / limit);

  return (
    <main>
      <div className="flex flex-col gap-8 md:flex-row-reverse md:justify-between">
        <TransactionModal
          categories={categories}
          currencies={currencies}
          currentCurrency={currentCurrency}
        />
        <SearchTransactions />
      </div>
      <section className="my-3">
        <Suspense
          key={`${name}-${page}`}
          fallback={
            <div className="my-10">
              <TableSkeleton />
            </div>
          }
        >
          <Transactions
            page={page}
            limit={limit}
            name={name as string}
            order={order}
            categoriesFilter={categoriesFilter}
            column={column}
            categories={categories}
            typesFilter={typesFilter}
          />
        </Suspense>

        <div className="mt-3 flex w-full items-center justify-between">
          <Pagination
            page={page}
            lastPage={lastPage}
            notNextPage={end > totalTransactions}
            notPreviousPage={page <= 1}
            name={name}
            limit={limit}
          />
          <RowsControls />
        </div>
      </section>
    </main>
  );
}
