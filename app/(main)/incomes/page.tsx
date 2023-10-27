import { TransactionsTable } from '@/components/transactions/transactions-table';
import { getIncomesOrExpenses } from '@/db/queries/transactions';

export default async function Page() {
  const transactions = await getIncomesOrExpenses('income');
  return (
    <div>
      <h1 className="text-xl font-medium mb-6">Incomes</h1>
      <TransactionsTable
        transactions={transactions}
        caption={'Table of your incomes'}
      />
    </div>
  );
}
