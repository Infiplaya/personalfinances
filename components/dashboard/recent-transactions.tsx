import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRecentTransactions } from '@/db/queries/transactions';
import { TransactionItem } from '../transaction-item';

export default async function RecentTransactions() {
  const transactions = await getRecentTransactions();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {transactions.map((t) => (
          <TransactionItem transaction={t} key={t.id} />
        ))}
      </CardContent>
    </Card>
  );
}
