import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRecentTransactions } from '@/db/queries/transactions';
import { CardTitleWithTooltip } from '../ui/card-title-with-tooltip';
import { TransactionItem } from './transaction-item';

export default async function RecentTransactions() {
  const transactions = await getRecentTransactions();
  return (
    <Card>
      <CardHeader>
        <CardTitleWithTooltip
          link="/transactions"
          message="List of your recent transactions"
        >
          <CardTitle>Recent Transactions</CardTitle>
        </CardTitleWithTooltip>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.map((t) => (
          <TransactionItem transaction={t} key={t.id} />
        ))}
      </CardContent>
    </Card>
  );
}
