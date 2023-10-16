import TableSkeleton from '@/components/skeletons/table-skeleton';
import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import { TransactionDrawer } from '@/components/transactions/transaction-drawer';
import { TransactionsTable } from '@/components/transactions/transactions-table';
import { db } from '@/db';
import { getCurrentProfile } from '@/db/queries/auth';
import { getCategories } from '@/db/queries/categories';
import { getCurrencies, getCurrentCurrency } from '@/db/queries/currencies';
import { calculateTotalForCategory } from '@/db/queries/transactions';
import { Suspense } from 'react';

async function getCategory(slug: string) {
  const currentProfile = await getCurrentProfile();
  return await db.query.categories.findFirst({
    where: (categories, { eq }) => eq(categories.slug, slug),
    with: {
      transactions: {
        where: (transactions, { eq }) =>
          eq(transactions.profileId, currentProfile.id),
      },
    },
  });
}

export default async function CategoriesPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await getCategory(params.slug);

  if (!category) {
    return <p>No such category transactions.</p>;
  }

  const totalAmountData = calculateTotalForCategory(category.name);

  const totalMonthData = calculateTotalForCategory(category.name, true);

  const categoriesData = getCategories();
  const currenciesData = getCurrencies();
  const currentCurrencyData = getCurrentCurrency();

  const [totalAmount, totalMonth, categories, currencies, currentCurrency] =
    await Promise.all([
      totalAmountData,
      totalMonthData,
      categoriesData,
      currenciesData,
      currentCurrencyData,
    ]);

  return (
    <main>
      <div className="mb-10">
        <div>
          <h1 className="mb-2 text-xl font-semibold lg:text-2xl">
            {category.name}
          </h1>
          <p className="text-sm">Total: {totalAmount.totalAmount}</p>
          <p className="text-sm">This Month: {totalMonth.totalAmount}</p>
        </div>

        <div className="flex w-full justify-end px-3 md:my-6">
          <div className="hidden md:block">
            <TransactionDialog
              categories={categories}
              currencies={currencies}
              currentCurrency={currentCurrency}
            />
          </div>

          <div className="md:hidden">
            <TransactionDrawer
              categories={categories}
              currencies={currencies}
              currentCurrency={currentCurrency}
            />
          </div>
        </div>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <TransactionsTable
          transactions={category.transactions}
          caption={`A list of transactions in ${category.name}`}
        />
      </Suspense>
    </main>
  );
}
