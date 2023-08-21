

import { TransactionDrawer } from '@/components/drawer';
import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import { getCategories } from '@/db/queries/categories';
import { TransactionByMonth } from './transactions-by-month';

interface Props {
    searchParams: {
      [key: string]: string | string[] | undefined;
    };
  }

export default async function TransactionsPage({ searchParams }: Props) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;

  const month = Number(searchParams['month']) ?? currentMonth;

  const categoriesData = await getCategories();

  return (
    <main className="mx-auto py-10">
      <div className="flex w-full justify-end px-3 lg:my-6">
        <TransactionDialog categories={categoriesData} />
        <div className="lg:hidden">
          <TransactionDrawer categories={categoriesData} />
        </div>
      </div>
      <TransactionByMonth month={month} />
    </main>
  );
}
