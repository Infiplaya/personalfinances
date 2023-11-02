import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { getSimilarTransactions } from '@/db/queries/transactions';
import { Transaction } from '@/db/schema/finances';
import Link from 'next/link';
import slugify from 'slugify';

export async function SimilarTransactions({
  transaction,
  list,
}: {
  transaction: Transaction;
  list?: boolean;
}) {
  const transactions = await getSimilarTransactions(
    transaction.name,
    transaction.type,
    transaction.categoryName
  );

  if (list) {
    return (
      <div className="mt-4">
        <h3 className="font-semibold text-neutral-700 dark:text-neutral-300">
          Similar Transactions
        </h3>
        <ul className="my-2 ml-6 list-disc text-neutral-700 dark:text-neutral-300 [&>li]:mt-2">
          {transactions.map((t) => (
            <a
              href={`/transactions/${slugify(t.name)}`}
              key={t.id}
              className="hover:underline"
            >
              <li>{t.name}</li>
            </a>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold">Similar transactions</h2>{' '}
      <div className="mt-2 flex flex-col space-y-4 md:flex-row md:space-x-8 md:space-y-0">
        {transactions.map((t) => (
          <Link
            href={`/transactions/${slugify(t.name)}`}
            key={t.id}
            className="block"
          >
            <Card className="bg-neutral-100 transition-colors hover:bg-neutral-50 dark:bg-neutral-950 dark:hover:bg-neutral-900">
              <CardHeader>
                <CardTitle className="space-x-3">
                  <div className="mb-4 space-x-2">
                    <Badge variant="secondary">{t.categoryName}</Badge>
                    <Badge variant="secondary">{t.type}</Badge>
                  </div>
                  <span className="text-lg md:text-xl">{t.name}</span>{' '}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
