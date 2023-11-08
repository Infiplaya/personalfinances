import {TableSkeleton} from '@/components/skeletons/table-skeleton';
import { TransactionsTable } from '@/components/transactions/transactions-table';
import {
  getCategory,
  getCategoryPageData,
} from '@/db/queries/categories';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { TransactionModal } from '@/components/transactions/transaction-modal';
import { Category } from '@/db/schema/finances';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const slug = params.slug;

  const category = await getCategory(slug);

  return {
    title: category?.name,
    description: 'Your transaction page',
  };
}

export default async function CategoriesPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await getCategory(params.slug);
  const { totalAmount, categories, currencies, currentCurrency, totalMonth } =
    await getCategoryPageData(category as Category);

  if (!category) {
    return <p>No such category transactions.</p>;
  }

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
          <TransactionModal
            categories={categories}
            currencies={currencies}
            currentCurrency={currentCurrency}
          />
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
