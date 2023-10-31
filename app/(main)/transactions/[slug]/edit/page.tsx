import { Card } from '@/components/ui/card';
import {
  getTransaction,
  getTransactionFormData,
} from '@/db/queries/transactions';
import { Back } from '@/components/ui/back';
import { TransactionForm } from '@/components/transactions/transaction-form';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function EditTransactionPage({
  params,
}: {
  params: { slug: string };
}) {
  const transaction = await getTransaction(params.slug);

  const { categories, currencies } = await getTransactionFormData();

  if (!transaction) {
    return <Card>No Transaction</Card>;
  }
  return (
    <div>
      <Back link="/transactions" />
      <TransactionForm
        categories={categories}
        currencies={currencies}
        edit={true}
        transaction={transaction}
      />
    </div>
  );
}
