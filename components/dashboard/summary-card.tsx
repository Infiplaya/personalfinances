import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  cn,
  moneyFormat,
} from '@/lib/utils';
import { Label } from '../ui/label';

import { CardTitleWithTooltip } from './card-title-with-tooltip';
import { getCurrentCurrency } from '@/db/queries/currencies';
import { getTotalIncomeAndExpenses } from '@/db/queries/transactions';


export default async function SummaryCard() {
  const currentCurrency = await getCurrentCurrency();
  const {totalBalance, totalExpenses, totalIncomes} = await getTotalIncomeAndExpenses(
    currentCurrency
  );

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
