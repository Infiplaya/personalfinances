import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, getMonth, moneyFormat } from '@/lib/utils';
import { Label } from '../ui/label';
import { CardTitleWithTooltip } from './card-title-with-tooltip';

interface Month {
  month: number | undefined;
  totalIncomes: number;
  totalExpenses: number;
  totalBalance: number;
}

export default function MonthlyBalanceCard({
  month,
  currencyCode,
}: {
  month: Month;
  currencyCode: string;
}) {
  if (month.month) {
    return (
      <Card key={month.month}>
        <CardHeader>
          <CardTitleWithTooltip
            link={`/transactions/months/${getMonth(month.month)}`}
            message={`Summary of incomes and spendings in ${getMonth(
              month.month,
              true
            )}`}
          >
            <CardTitle>{getMonth(month.month, true)}</CardTitle>
          </CardTitleWithTooltip>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Income</Label>
            <p className="text-lg font-semibold">
              {moneyFormat(Number(month.totalIncomes), currencyCode)}
            </p>
          </div>
          <div>
            <Label>Expenses</Label>
            <p className="text-lg font-semibold">
              {moneyFormat(Number(month.totalExpenses), currencyCode)}
            </p>
          </div>
          <div>
            <Label>Balance</Label>
            <p
              className={cn(
                'text-lg font-semibold',
                Number(month.totalBalance) > 0
                  ? 'text-green-500 dark:text-green-400'
                  : 'text-red-500 dark:text-red-400'
              )}
            >
              {moneyFormat(Number(month.totalBalance), currencyCode)}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
