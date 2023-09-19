import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db';
import { transactions } from '@/db/schema/finances';
import { authOptions } from '@/lib/auth/auth';
import { cn, moneyFormat } from '@/lib/utils';
import { eq, sql } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { Label } from '../ui/label';

import { CardTitleWithTooltip } from './card-title-with-tooltip';
import { getCurrentCurrency } from '@/db/queries/currencies';

async function getTotalIncomeAndExpenses(userId: string) {
  const result = await db
    .select({
      totalIncome: sql<number>`sum(CASE WHEN transactions.type = 'income' THEN transactions.amount ELSE 0 END)`,
      totalExpenses: sql<number>`sum(CASE WHEN transactions.type = 'expense' THEN transactions.amount ELSE 0 END)`,
    })
    .from(transactions)
    .where(eq(transactions.userId, userId));

  return {
    totalExpenses: result[0].totalExpenses,
    totalIncome: result[0].totalIncome,
    totalBalance:
      Number(result[0].totalIncome) - Number(result[0].totalExpenses),
  };
}

export default async function SummaryCard() {
  const session = await getServerSession(authOptions);
  const { totalExpenses, totalIncome, totalBalance } =
    await getTotalIncomeAndExpenses(session?.user.id as string);

  const currentCurrency = await getCurrentCurrency();
  return (
    <Card>
      <CardHeader>
        <CardTitleWithTooltip message="Summary of all your transactions.">
          <CardTitle>Summary</CardTitle>
        </CardTitleWithTooltip>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label>Income</Label>
          <p className="text-lg font-semibold">
            {moneyFormat(totalIncome, currentCurrency)}
          </p>
        </div>
        <div>
          <Label>Expenses</Label>
          <p className="text-lg font-semibold">
            {moneyFormat(totalExpenses, currentCurrency)}
          </p>
        </div>
        <div>
          <Label>Balance</Label>
          <p
            className={cn(
              'text-lg font-semibold',
              totalBalance > 0
                ? 'text-green-500 dark:text-green-400'
                : 'text-red-500 dark:text-red-400'
            )}
          >
            {moneyFormat(totalBalance, currentCurrency)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
