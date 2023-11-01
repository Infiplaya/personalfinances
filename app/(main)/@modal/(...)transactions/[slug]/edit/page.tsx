import EditTransaction from '@/app/(main)/transactions/[slug]/edit/edit-transaction';
import {
  getTransaction,
  getTransactionFormData,
} from '@/db/queries/transactions';
import { notFound } from 'next/navigation';

export default async function TransactionModalPage({
  params,
}: {
  params: { slug: string };
}) {
  const { categories, currencies } = await getTransactionFormData();

  const transaction = await getTransaction(params.slug);

  if (!transaction) return notFound();

  return (
    <EditTransaction
      categories={categories}
      currencies={currencies}
      edit={true}
      transaction={transaction}
    />
  );
}
