import { TransactionsTable } from '@/components/transactions/transactions-table';
import { getTransactionsByMonth } from '@/db/queries/transactions';
import { getMonth } from '@/lib/utils';

export async function TransactionByMonth({ month }: { month: number }) {
  const transactions = await getTransactionsByMonth(month);
  return (
    <section className="mt-10">
      {transactions ? (
        <TransactionsTable
          transactions={transactions}
          caption={`Transactions in month ${getMonth(month, true)}`}
        />
      ) : (
        <div>No transactions found for this month</div>
      )}
    </section>
  );
}
