import { TransactionItem } from '@/components/transaction-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db';
import { getCurrentProfile } from '@/db/queries/auth';
import { transactions } from '@/db/schema/finances';
import { and, eq } from 'drizzle-orm';

async function getCategory(name: string) {
  const currentProfile = await getCurrentProfile();
  return await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.profileId, currentProfile.id),
        eq(transactions.categoryName, name)
      )
    );
}

export default async function CategoriesPage({
  params,
}: {
  params: { name: string };
}) {
  const transactions = await getCategory(params.name);
  return (
    <main className="space-y-10 py-10">
      {transactions ? (
        <Card>
          <CardHeader>
            <CardTitle>{params.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.map((t) => (
              <TransactionItem key={t.id} transaction={t} />
            ))}
          </CardContent>
        </Card>
      ) : (
        <p>No such category transactions.</p>
      )}
    </main>
  );
}
