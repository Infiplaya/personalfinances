import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { db } from '@/db';
import { getCurrentProfile } from '@/db/queries/auth';
import {
  getAllTransactionsSlugs,
  getTransaction,
  getTransactionFormData,
} from '@/db/queries/transactions';
import { transactions } from '@/db/schema/finances';
import { moneyFormat } from '@/lib/utils';
import { and, eq } from 'drizzle-orm';
import { TransactionForm } from '@/components/transactions/transaction-form';

import type { Metadata, ResolvingMetadata } from 'next';
import { SimilarTransactions } from './similar-transactions';
import Link from 'next/link';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Back } from '@/components/ui/back';
import { DrawerContent, DrawerRoot } from '@/components/ui/drawer';
import EditTransaction from './edit/edit-transaction';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
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
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const transaction = await getTransaction(params.slug);
  const edit = searchParams.edit;

  const { categories, currencies } = await getTransactionFormData();

  if (!transaction) {
    return <Card>No Transaction</Card>;
  }
  return (
    <div>
      <Back link="/transactions" />
      <EditTransaction
        categories={categories}
        currencies={currencies}
        edit={edit ? true : false}
        transaction={transaction}
      />
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
      <p>{transaction?.description}</p>
      <Suspense fallback={<Skeleton className="mt-12 h-24 w-full" />}>
        <SimilarTransactions transaction={transaction} />
      </Suspense>
    </div>
  );
}
