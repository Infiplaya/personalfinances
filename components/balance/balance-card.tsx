import { getBalancesForUser } from '@/db/queries/transactions';
import { cn, moneyFormat } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '../ui/card';
import { CardTitleWithTooltip } from '../ui/card-title-with-tooltip';

export async function BalanceCard({ currencyCode }: { currencyCode: string }) {
  const balances = await getBalancesForUser(currencyCode);
  return (
    <Card>
      <CardHeader>
        <CardTitleWithTooltip
          message="Your current balance for every profile"
          link="/balances"
        >
          Balance
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
                  b.balance >= 0
                    ? 'text-green-500 dark:text-green-400'
                    : 'text-red-500 dark:text-red-400'
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
