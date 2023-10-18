import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn, getMonth, moneyFormat } from '@/lib/utils';
import { Label } from '../ui/label';

import { CardTitleWithTooltip } from '../ui/card-title-with-tooltip';
import { getCurrentCurrency } from '@/db/queries/currencies';
import { getTotalIncomeAndExpenses } from '@/db/queries/transactions';

export default async function SummaryCard({
  currentMonth,
}: {
  currentMonth?: number;
}) {
  const currentCurrency = await getCurrentCurrency();
  const { totalBalance, totalExpenses, totalIncomes, month } =
    await getTotalIncomeAndExpenses(
      currentCurrency,
      currentMonth ? currentMonth : undefined
    );

  if (month) {
    return (
      <Card>
        <CardHeader>
          <CardTitleWithTooltip
            link={`/months/${getMonth(month)}`}
            message={`Summary of incomes and spendings in ${getMonth(
              month,
              true
            )}`}
          >
            {getMonth(month, true)}
          </CardTitleWithTooltip>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Income</Label>
            <p className="text-lg font-semibold">
              {moneyFormat(Number(totalIncomes), currentCurrency)}
            </p>
          </div>
          <div>
            <Label>Expenses</Label>
            <p className="text-lg font-semibold">
              {moneyFormat(Number(totalExpenses), currentCurrency)}
            </p>
          </div>
          <div>
            <Label>Balance</Label>
            <p
              className={cn(
                'text-lg font-semibold',
                Number(totalBalance) > 0
                  ? 'text-green-500 dark:text-green-400'
                  : 'text-red-500 dark:text-red-400'
              )}
            >
              {moneyFormat(Number(totalBalance), currentCurrency)}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitleWithTooltip message="Summary of all your transactions.">
          Summary
        </CardTitleWithTooltip>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label>Income</Label>
          <p className="text-lg font-semibold">
            {moneyFormat(totalIncomes, currentCurrency)}
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
