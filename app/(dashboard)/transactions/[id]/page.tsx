import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db';
import { getAllTransactionsIds } from '@/db/queries/transactions';
import { transactions } from '@/db/schema/finances';
import { moneyFormat } from '@/lib/utils';
import { eq } from 'drizzle-orm';

async function getTransaction(transactionId: number) {
  return await db.query.transactions.findFirst({
    where: eq(transactions.id, transactionId),
    with: {
      category: true,
    },
  });
}

export async function generateStaticParams() {
  const result = await getAllTransactionsIds();

  return result.map((t) => t.id);
}

export default async function TransactionsPage({
  params,
}: {
  params: { id: string };
}) {
  const transaction = await getTransaction(Number(params.id));

  if (!transaction) {
    return <Card>No Transaction</Card>;
  }
  return (
    <div className="py-10">
      <Card>
        <CardHeader>
          <CardTitle>
            {transaction.amount
              ? moneyFormat(Number(transaction.amount))
              : null}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="pb-4">
            <p>{transaction?.name}</p>
            <p>{transaction?.description}</p>
          </div>
          <p>Category: {transaction?.categoryName}</p>
          <p>Type: {transaction?.type}</p>
        </CardContent>
      </Card>
    </div>
  );
}
