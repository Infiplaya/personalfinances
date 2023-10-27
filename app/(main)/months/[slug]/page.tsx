import { TransactionDrawer } from '@/components/transactions/transaction-drawer';
import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import { getCategories } from '@/db/queries/categories';
import { getMonthIndex } from '@/lib/utils';
import { TransactionByMonth } from './transactions-by-month';
import { getCurrencies, getCurrentCurrency } from '@/db/queries/currencies';
import { Metadata, ResolvingMetadata } from 'next';
import { getTransactionsByMonth } from '@/db/queries/transactions';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;

  const month = params.slug.charAt(0).toUpperCase() + slug.slice(1);

  return {
    title: `Transactions in ${month}`,
    description: `Transactions in month ${month}`,
  };
}

export default async function MonthPage({
  params,
}: {
  params: { slug: string };
}) {
  const categoriesData = getCategories();
  const currenciesData = getCurrencies();
  const currentCurrencyData = getCurrentCurrency();

  const [categories, currencies, currentCurrency] = await Promise.all([
    categoriesData,
    currenciesData,
    currentCurrencyData,
  ]);

  return (
    <main>
      <div>
        <h1 className="mb-2 text-xl font-semibold lg:text-2xl">
          {params.slug.charAt(0).toUpperCase() + params.slug.slice(1)}
        </h1>
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
      <TransactionByMonth month={getMonthIndex(params.slug)} />
    </main>
  );
}
