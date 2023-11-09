import { getTransaction } from '@/db/queries/transactions';
import { EditTransaction } from './edit-transaction';
import { notFound } from 'next/navigation';

export default async function EditTransactionPage({
  params,
}: {
  params: { slug: string };
}) {
  const transaction = await getTransaction(params.slug);

  if (!transaction) {
    return notFound();
  }

  return <EditTransaction transaction={transaction} />;
}
