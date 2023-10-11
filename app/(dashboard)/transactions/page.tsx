import { DataTable } from '@/components/data-table/data-table';
import { TransactionDrawer } from '@/components/transactions/transaction-drawer';
import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import { getCategories } from '@/db/queries/categories';
import { getCurrencies, getCurrentCurrency } from '@/db/queries/currencies';

import { countTransactions, getTransactions } from '@/db/queries/transactions';
import { Transaction } from '@/db/schema/finances';
import { columns } from './columns';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  ArrowRightIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { RowsControls } from '@/components/data-table/data-table-rows';
interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}
export default async function TransactionsPage({ searchParams }: Props) {
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

  const transactions = await getTransactions(
    limit,
    page,
    name,
    column,
    order,
    categoriesFilter,
    typesFilter
  );

  const categoriesData = await getCategories();

  const currenciesData = await getCurrencies();

  const currentCurrency = await getCurrentCurrency();

  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit);
  const totalTransactions = transactions.length + 1;

  const hasNextPage = totalTransactions > page * limit;
  const lastPage = Math.ceil(totalTransactions / limit);

  return (
    <main>
      <div className="justify-end md:mb-6 md:flex">
        <div className="hidden md:block">
          <TransactionDialog
            categories={categoriesData}
            currencies={currenciesData}
            currentCurrency={currentCurrency}
          />
        </div>

        <div className="md:hidden">
          <TransactionDrawer
            categories={categoriesData}
            currencies={currenciesData}
            currentCurrency={currentCurrency}
          />
        </div>
      </div>

      <DataTable
        categories={categoriesData}
        columns={columns}
        data={transactions}
        count={transactions.length}
      />

      <div className="mt-3 flex w-full items-center justify-between">
        <div className="flex items-center space-x-6">
          <p className="text-sm">
            Page {page} of {lastPage}
          </p>
          <div className="flex space-x-2">
            <Link
              href={{
                pathname: '/transactions',
                query: {
                  ...(name ? { name } : {}),
                  page: 1,
                },
              }}
              className={cn(
                'rounded border bg-gray-100 p-1 text-sm text-gray-800',
                page <= 1 && 'pointer-events-none opacity-50'
              )}
            >
              <span className="sr-only">Go to first page</span>
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Link>
            <Link
              href={{
                pathname: '/transactions',
                query: {
                  ...(name ? { name } : {}),
                  page: page > 1 ? page - 1 : 1,
                },
              }}
              className={cn(
                'rounded border bg-gray-100 p-1  text-sm text-gray-800',
                page <= 1 && 'pointer-events-none opacity-50'
              )}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Link>
            <Link
              href={{
                pathname: '/transactions',
                query: {
                  ...(name ? { name } : {}),
                  page: page + 1,
                },
              }}
              className={cn(
                'rounded border bg-gray-100 p-1  text-sm text-gray-800',
                end > transactions.length && 'pointer-events-none opacity-50'
              )}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href={{
                pathname: '/transactions',
                query: {
                  ...(name ? { name } : {}),
                  page: lastPage,
                },
              }}
              className={cn(
                'rounded border bg-gray-100 p-1  text-sm text-gray-800',
                !hasNextPage && 'pointer-events-none opacity-50'
              )}
            >
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <RowsControls />
      </div>
    </main>
  );
}
