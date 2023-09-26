import { TransactionItem } from '@/components/transaction-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db';
import { getCurrentProfile } from '@/db/queries/auth';
import { transactions } from '@/db/schema/finances';
import { and, eq } from 'drizzle-orm';

async function getCategory(slug: string) {
  const currentProfile = await getCurrentProfile();
  return await db.query.categories.findFirst({
    where: (categories, { eq }) => eq(categories.slug, slug),
    with: {
      transactions: {
        where: (transactions, { eq }) =>
          eq(transactions.profileId, currentProfile.id),
      },
    },
  });
}

export default async function CategoriesPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await getCategory(params.slug);
  return (
    <main className="space-y-10 py-10">
      {category ? (
        <Card>
          <CardHeader>
            <CardTitle>{category.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {category.transactions.map((t) => (
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
