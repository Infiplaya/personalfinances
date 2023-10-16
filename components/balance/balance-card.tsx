import { getCurrentCurrency } from '@/db/queries/currencies';
import { getBalancesForUser } from '@/db/queries/transactions';
import { cn, moneyFormat } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CardTitleWithTooltip } from '../ui/card-title-with-tooltip';

export async function BalanceCard({
  currentBalance,
}: {
  currentBalance: number;
}) {
  const currencyCode = await getCurrentCurrency();
  const balances = await getBalancesForUser(currencyCode);
  return (
    <Card>
      <CardHeader>
        <CardTitleWithTooltip
          message="Your current balance for every profile"
          link="/balances"
        >
          <CardTitle>Balance</CardTitle>
        </CardTitleWithTooltip>
      </CardHeader>
      <CardContent>
        <ul className="space-y-6">
          {balances.map((b) => (
            <li
              key={b.name}
              className="flex items-center justify-between text-sm"
            >
              <span>{b.name}</span>
              <span
                className={cn(
                  'font-semibold',
                  b.balance >= 0 ? 'text-green-500' : 'text-red-500'
                )}
              >
                {moneyFormat(b.balance, currencyCode)}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
