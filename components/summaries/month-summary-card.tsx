import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, getMonth, moneyFormat } from '@/lib/utils';
import { Label } from '../ui/label';

import { CardTitleWithTooltip } from '../ui/card-title-with-tooltip';
import { getCurrentCurrency } from '@/db/queries/currencies';

interface MonthData {
  totalExpenses: number;
  totalIncomes: number;
  month: number;
  totalBalance: number;
}

export default async function MonthSummaryCard({
  monthData,
}: {
  monthData: MonthData;
}) {
  const currentCurrency = await getCurrentCurrency();
  return (
    <Card>
      <CardHeader>
        <CardTitleWithTooltip
          link={`/months/${getMonth(monthData.month)}`}
          message={`Summary of incomes and spendings in ${getMonth(
            monthData.month,
            true
          )}`}
        >
          <CardTitle>{getMonth(monthData.month, true)}</CardTitle>
        </CardTitleWithTooltip>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label>Income</Label>
          <p className="text-lg font-semibold">
            {moneyFormat(Number(monthData.totalIncomes), currentCurrency)}
          </p>
        </div>
        <div>
          <Label>Expenses</Label>
          <p className="text-lg font-semibold">
            {moneyFormat(Number(monthData.totalExpenses), currentCurrency)}
          </p>
        </div>
        <div>
          <Label>Balance</Label>
          <p
            className={cn(
              'text-lg font-semibold',
              Number(monthData.totalBalance) > 0
                ? 'text-green-500 dark:text-green-400'
                : 'text-red-500 dark:text-red-400'
            )}
          >
            {moneyFormat(Number(monthData.totalBalance), currentCurrency)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
