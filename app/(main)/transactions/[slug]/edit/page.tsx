import {
  getTransaction,
  getTransactionFormData,
} from '@/db/queries/transactions';
import { EditTransaction } from './edit-transaction';
import { notFound } from 'next/navigation';

export default async function EditTransactionPage({
  params,
}: {
  params: { slug: string };
}) {
  const transaction = await getTransaction(params.slug);

  const { categories, currencies } = await getTransactionFormData();

  if (!transaction) {
    return notFound();
  }

  return (
    <EditTransaction
      categories={categories}
      currencies={currencies}
      edit={true}
      transaction={transaction}
    />
  );
}
