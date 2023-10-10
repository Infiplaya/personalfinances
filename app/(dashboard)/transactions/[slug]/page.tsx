import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db';
import { getAllTransactionsSlugs } from '@/db/queries/transactions';
import { transactions } from '@/db/schema/finances';
import { moneyFormat } from '@/lib/utils';
import { eq } from 'drizzle-orm';

async function getTransaction(slug: string) {
  return await db.query.transactions.findFirst({
    where: eq(transactions.slug, slug),
    with: {
      category: true,
    },
  });
}

export async function generateStaticParams() {
  return await getAllTransactionsSlugs();
}

export default async function TransactionsPage({
  params,
}: {
  params: { slug: string };
}) {
  const transaction = await getTransaction(params.slug);

  if (!transaction) {
    return <Card>No Transaction</Card>;
  }
  return (
    <div className="py-10">
      {transaction.amount
        ? moneyFormat(Number(transaction.amount), transaction.currencyCode)
        : null}

      <div className="pb-4">
        <p>{transaction?.name}</p>
        <p>{transaction?.description}</p>
      </div>
      <p>Category: {transaction?.categoryName}</p>
      <p>Type: {transaction?.type}</p>

      <div>See more similar transactions: </div>
    </div>
  );
}
