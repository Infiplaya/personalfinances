import { getTransaction } from '@/db/queries/transactions';
import { notFound } from 'next/navigation';
import ViewTransaction from './view-transaction';
import { moneyFormat } from '@/lib/utils';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { SimilarTransactions } from '@/app/(main)/transactions/[slug]/similar-transactions';

export default async function TransactionModalPage({
  params,
}: {
  params: { slug: string };
}) {
  const transaction = await getTransaction(params.slug);
  if (!transaction) return notFound();
  return (
    <ViewTransaction>
      <div className="mb-3 space-x-3">
        <a href={`/${transaction.type}s`}>
          <Badge>{transaction.type}</Badge>
        </a>
        <a href={`/categories/${transaction.categoryName}`}>
          <Badge>{transaction.categoryName}</Badge>
        </a>
      </div>
      <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight">
        {transaction.name} -{' '}
        {moneyFormat(transaction.amount, transaction.currencyCode)}{' '}
      </h1>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        {transaction.description
          ? transaction.description
          : 'No description provided'}
      </p>

      <Suspense fallback={<Skeleton className="mt-12 h-24 w-full" />}>
        <SimilarTransactions list={true} transaction={transaction} />
      </Suspense>
    </ViewTransaction>
  );
}
