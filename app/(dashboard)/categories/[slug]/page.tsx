import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db';
import { categories } from '@/db/schema/finances';
import { unslugify } from '@/lib/utils';
import { eq } from 'drizzle-orm';

async function getCategory(slug: string) {
  return await db.query.categories.findFirst({
    where: eq(categories.name, unslugify(slug)),
    with: {
      transactions: true,
    },
  });
}

export default async function CategoriesPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await getCategory(params.slug);
  return <main className="space-y-10 py-10">
    {JSON.stringify(category)}
  </main>;
}
