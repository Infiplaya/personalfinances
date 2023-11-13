import { getMonthIndex } from '@/lib/utils';
import { TransactionByMonth } from './transactions-by-month';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { TableSkeleton } from '@/components/skeletons/table-skeleton';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
  return (
    <main>
      <div>
        <h1 className="mb-2 text-xl font-semibold lg:text-2xl">
          {params.slug.charAt(0).toUpperCase() + params.slug.slice(1)}
        </h1>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <TransactionByMonth month={getMonthIndex(params.slug)} />
      </Suspense>
    </main>
  );
}
