import { getMonthIndex } from '@/lib/utils';
import { TransactionByMonth } from './transactions-by-month';
import { Metadata } from 'next';
import { TransactionModal } from '@/components/transactions/transaction-modal';
import { Suspense } from 'react';
import TableSkeleton from '@/components/skeletons/table-skeleton';
import { getTransactionFormData } from '@/db/queries/transactions';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
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
  const { categories, currencies, currentCurrency } =
    await getTransactionFormData();

  return (
    <main>
      <div>
        <h1 className="mb-2 text-xl font-semibold lg:text-2xl">
          {params.slug.charAt(0).toUpperCase() + params.slug.slice(1)}
        </h1>
      </div>
      <div className="flex w-full justify-end px-3 md:my-6">
        <TransactionModal
          categories={categories}
          currencies={currencies}
          currentCurrency={currentCurrency}
        />
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <TransactionByMonth month={getMonthIndex(params.slug)} />
      </Suspense>
    </main>
  );
}
