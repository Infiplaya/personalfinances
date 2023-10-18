import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getSimilarTransactions } from '@/db/queries/transactions';
import { Transaction } from '@/db/schema/finances';
import Link from 'next/link';
import slugify from 'slugify';

export async function SimilarTransactions({
  transaction,
}: {
  transaction: Transaction;
}) {
  const transactions = await getSimilarTransactions(
    transaction.name,
    transaction.type,
    transaction.categoryName
  );
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
            <Card className="bg-gray-100 dark:bg-gray-950">
              <CardHeader>
                <CardTitle className="space-x-3">
                  <div className="mb-4 space-x-2">
                    <Badge variant="secondary">{t.categoryName}</Badge>
                    <Badge variant="secondary">{t.type}</Badge>
                  </div>
                  <span>{t.name}</span>{' '}
                </CardTitle>
                <CardDescription>{t.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
