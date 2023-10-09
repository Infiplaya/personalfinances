import TableSkeleton from '@/components/skeletons/table-skeleton';
import { TransactionsTable } from '@/components/transactions/transactions-table';
import { getTransactionsByMonth } from '@/db/queries/transactions';
import { getMonth } from '@/lib/utils';
import { Suspense } from 'react';

export async function TransactionByMonth({ month }: { month: number }) {
  const transactions = await getTransactionsByMonth(month);
  return (
    <section className="mt-10">
      {transactions ? (
        <Suspense fallback={<TableSkeleton />}>
          <TransactionsTable
            transactions={transactions}
            caption={`Transactions in month ${getMonth(month, true)}`}
          />
        </Suspense>
      ) : (
        <div>No transactions found for this month</div>
      )}
    </section>
  );
}
