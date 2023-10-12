import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db';
import { getCurrentProfile } from '@/db/queries/auth';
import { getCategories } from '@/db/queries/categories';
import { getCurrencies, getCurrentCurrency } from '@/db/queries/currencies';
import { getAllTransactionsSlugs } from '@/db/queries/transactions';
import { transactions } from '@/db/schema/finances';
import { moneyFormat } from '@/lib/utils';
import { and, eq } from 'drizzle-orm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TransactionForm } from '@/components/transactions/transaction-form';

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
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const transaction = await getTransaction(params.slug);
  const edit = searchParams.edit;

  const categories = await getCategories();
  const currencies = await getCurrencies();

  if (!transaction) {
    return <Card>No Transaction</Card>;
  }
  return (
    <div>
      <Dialog open={edit ? true : false}>
        <DialogContent>
          <TransactionForm
            categories={categories.filter((c) => c.type === transaction.type)}
            currencies={currencies}
            transaction={transaction}
            edit={true}
          />
        </DialogContent>
      </Dialog>
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
