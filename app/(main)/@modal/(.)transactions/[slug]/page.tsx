import { getTransaction } from '@/db/queries/transactions';
import { notFound } from 'next/navigation';
import ViewTransaction from './view-transaction';

export default async function TransactionModalPage({
  params,
}: {
  params: { slug: string };
}) {
  const transaction = await getTransaction(params.slug);
  if (!transaction) return notFound();
  return <ViewTransaction transaction={transaction} />;
}
