export const revalidate = 24000;

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db';
import { categories } from '@/db/schema/finances';
import Link from 'next/link';

export default async function CategoriesPage() {
  const categoriesData = await db.select().from(categories);
  return (
    <div className="space-y-10 py-10">
      <div className="grid lg:grid-cols-2 lg:gap-x-10">
        <Card>
          <CardHeader>
            <CardTitle>Categories of Incomes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              {categoriesData.map((c) =>
                c.type === 'income' ? (
                  <Link
                    key={c.id}
                    href={`/transactions?category=${c.name}`}
                    className="block rounded-md py-2 pl-6 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {c.name}
                  </Link>
                ) : null
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Categories of Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              {categoriesData.map((c) =>
                c.type === 'expense' ? (
                  <Link
                    key={c.id}
                    href={`/transactions?category=${c.name}`}
                    className="block rounded-md py-2 pl-6 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {c.name}
                  </Link>
                ) : null
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
