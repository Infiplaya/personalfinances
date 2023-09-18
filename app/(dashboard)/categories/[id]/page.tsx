import { TransactionItem } from '@/components/transaction-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db';
import { categories } from '@/db/schema/finances';
import { eq } from 'drizzle-orm';

async function getCategory(id: number) {
  return await db.query.categories.findFirst({
    where: eq(categories.id, id),
    with: {
      transactions: true,
    },
  });
}

export default async function CategoriesPage({
  params,
}: {
  params: { id: number };
}) {
  const category = await getCategory(params.id);
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
        <div>No such category</div>
      )}
    </main>
  );
}
