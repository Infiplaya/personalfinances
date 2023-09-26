import { TransactionItem } from '@/components/transaction-item';
import { TransactionsTable } from '@/components/transactions/transactions-table';
import { getTransactionsByMonth } from '@/db/queries/transactions';

export async function TransactionByMonth({ month }: { month: number }) {
  const transactions = await getTransactionsByMonth(month);
  return (
    <section className="mt-10">
      {transactions ? (
        <TransactionsTable transactions={transactions} />
      ) : (
        <div>No transactions found for this month</div>
      )}
    </section>
  );
}
