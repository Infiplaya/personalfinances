import { DataTable } from '@/components/data-table/data-table';
import { TransactionDrawer } from '@/components/transactions/transaction-drawer';
import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import { getCategories } from '@/db/queries/categories';
import {
  getCurrencies,
  getCurrentCurrency,
} from '@/db/queries/currencies';

import { countTransactions, getTransactions } from '@/db/queries/transactions';
import { Transaction } from '@/db/schema/finances';
import { columns } from './columns';
interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}
export default async function TransactionsPage({ searchParams }: Props) {
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
    typesFilter
  );

  const transactionsCount = await countTransactions();

  const categoriesData = await getCategories();

  const currenciesData = await getCurrencies();

  const currentCurrency = await getCurrentCurrency();

  return (
    <main>
      <div className="flex w-full justify-end space-x-6 px-3 lg:my-6">
        <TransactionDialog
          categories={categoriesData}
          currencies={currenciesData}
          currentCurrency={currentCurrency}
        />
        <div className="lg:hidden">
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
        count={transactionsCount}
      />
    </main>
  );
}
