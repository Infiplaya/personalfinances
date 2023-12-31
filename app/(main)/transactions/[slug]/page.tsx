import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  getAllTransactionsSlugs,
  getTransaction,
} from '@/db/queries/transactions';
import { moneyFormat } from '@/lib/utils';

import type { Metadata } from 'next';
import { SimilarTransactions } from './similar-transactions';
import Link from 'next/link';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Back } from '@/components/ui/back';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;

  const transaction = await getTransaction(slug);

  return {
    title: transaction?.name,
    description: 'Your transaction page',
  };
}

export async function generateStaticParams() {
  return await getAllTransactionsSlugs();
}

export default async function TransactionsPage({
  params,
}: {
  params: { slug: string };
}) {
  const transaction = await getTransaction(params.slug);

  if (!transaction) {
    return <Card>No Transaction</Card>;
  }
  return (
    <div>
      <Back link="/transactions" />
      <div className="mb-3 mt-10 space-x-3">
        <Link href={`/${transaction.type}s`}>
          <Badge>{transaction.type}</Badge>
        </Link>
        <Badge>{transaction.categoryName}</Badge>
      </div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {transaction.name} -{' '}
        {moneyFormat(transaction.amount, transaction.currencyCode)}{' '}
      </h1>
      <p>
        {transaction.description
          ? transaction.description
          : 'No description provided'}
      </p>
      <Suspense fallback={<Skeleton className="mt-12 h-24 w-full" />}>
        <SimilarTransactions transaction={transaction} />
      </Suspense>
    </div>
  );
}
