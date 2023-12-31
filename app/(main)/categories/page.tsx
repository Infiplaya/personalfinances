export const revalidate = 360000;

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCategories } from '@/db/queries/categories';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Categories of transactions',
};

export default async function CategoriesPage() {
  const categoriesData = await getCategories();
  return (
    <div>
      <div className="grid space-y-10 lg:grid-cols-2 lg:gap-x-10 lg:space-y-0">
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
                    href={`/categories/${c.slug}`}
                    className="block rounded-md py-2 pl-6 hover:bg-neutral-100 dark:hover:bg-neutral-800"
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
                    href={`/categories/${c.slug}`}
                    className="block rounded-md py-2 pl-6 hover:bg-neutral-100 dark:hover:bg-neutral-800"
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
