import { getCurrentCurrency } from '@/db/queries/currencies';
import { cn, moneyFormat } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CardTitleWithTooltip } from './card-title-with-tooltip';

export async function BalanceCard({
  currentBalance,
}: {
  currentBalance: number;
}) {
  const currencyCode = await getCurrentCurrency();
  return (
    <Card>
      <CardHeader>
        <CardTitleWithTooltip message="Your current balance" link='/balances'>
          <CardTitle>Balance</CardTitle>
        </CardTitleWithTooltip>
      </CardHeader>
      <CardContent>
        <span
          className={cn(
            'text-lg font-semibold',
            currentBalance > 0 ? 'text-green-500' : 'text-red-500'
          )}
        >
          {moneyFormat(currentBalance, currencyCode)}
        </span>
      </CardContent>
    </Card>
  );
}
