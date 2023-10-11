import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db';
import { getCurrentProfile } from '@/db/queries/auth';
import { getAllTransactionsSlugs } from '@/db/queries/transactions';
import { transactions } from '@/db/schema/finances';
import { moneyFormat } from '@/lib/utils';
import { and, eq } from 'drizzle-orm';

async function getTransaction(slug: string) {
  const currentProfile = await getCurrentProfile();

  return await db.query.transactions.findFirst({
    where: and(
      eq(transactions.slug, slug),
      eq(transactions.profileId, currentProfile.id)
    ),
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
    <div>
      <Card>
        <CardHeader>
          <div className="mb-3 space-x-3">
            <Badge>{transaction?.type}</Badge>
            <Badge>{transaction?.categoryName}</Badge>
          </div>
          <CardTitle>
            {transaction.name} -{' '}
            {moneyFormat(transaction.amount, transaction.currencyCode)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{transaction?.description}</p>
        </CardContent>
      </Card>
      <div className="mt-6">See more similar transactions: </div>
    </div>
  );
}
