import { TransactionsTable } from '@/components/transactions/transactions-table';
import { getIncomesOrExpenses } from '@/db/queries/transactions';

export default async function Page() {
  const transactions = await getIncomesOrExpenses('expense');
  return (
    <div>
      <h1 className="mb-6 text-xl font-medium">Expenses</h1>
      <TransactionsTable
        transactions={transactions}
        caption={'Table of your expenses'}
      />
    </div>
  );
}
