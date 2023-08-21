import { TransactionItem } from '@/components/transaction-item';
import { getTransactionsByMonth } from '@/db/queries/transactions';

export async function TransactionByMonth({ month }: { month: number }) {
  const transactions = await getTransactionsByMonth(month);
  return (
    <section className="mt-10">
      {transactions ? (
        transactions.map((t) => <TransactionItem key={t.id} transaction={t} />)
      ) : (
        <div>No transactions found for this month</div>
      )}
    </section>
  );
}
