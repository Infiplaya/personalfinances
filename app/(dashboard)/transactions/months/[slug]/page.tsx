import { TransactionDrawer } from '@/components/transactions/transaction-drawer';
import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import { getCategories } from '@/db/queries/categories';
import { getMonthIndex } from '@/lib/utils';
import { TransactionByMonth } from './transactions-by-month';

export default async function MonthPage({params}: {params: {slug: string}}) {
  const categoriesData = await getCategories();

  console.log(getMonthIndex(params.slug))

  return (
    <main className="mx-auto py-10">
      <div className="flex w-full justify-end px-3 lg:my-6">
        <TransactionDialog categories={categoriesData} />
        <div className="lg:hidden">
          <TransactionDrawer categories={categoriesData} />
        </div>
      </div>
      <TransactionByMonth month={getMonthIndex(params.slug)} />
    </main>
  );
}
