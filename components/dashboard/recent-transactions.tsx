import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db';

import { authOptions } from '@/lib/auth/auth';

import { getServerSession } from 'next-auth';

import { TransactionItem } from '../transaction-item';

async function getRecentTransactions(userId: string) {
  return await db.query.transactions.findMany({
    limit: 6,
    orderBy: (transactions, { desc }) => [desc(transactions.timestamp)],
    with: {
      category: true,
    },
    where: (transactions, { eq }) => eq(transactions.userId, userId),
  });
}

export default async function RecentTransactions() {
  const session = await getServerSession(authOptions);
  const transactions = await getRecentTransactions(session?.user.id as string);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {transactions.map((t) => (
            <TransactionItem transaction={t} key={t.id} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


