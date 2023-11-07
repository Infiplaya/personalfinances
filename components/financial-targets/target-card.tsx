import { getCurrencies, getCurrentCurrency } from '@/db/queries/currencies';
import { getTarget, TargetType, TimePeriod } from '@/db/queries/targets';
import { getExpenseForTime, getIncomeForTime } from '@/db/queries/transactions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { TargetModal } from './target-modal';
import { SelectTargetPeriod } from './select-period';
import { TargetCardContent } from './target-card-content';

export async function TargetCard({
  targetPeriod,
  targetType,
}: {
  targetPeriod: TimePeriod;
  targetType: TargetType;
}) {
  const target = await getTarget(targetPeriod, targetType);
  const currency = await getCurrentCurrency();
  const currencies = await getCurrencies();

  if (!target) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex justify-between">
            <div className="space-y-1">
              <CardTitle className="capitalize">
                {targetPeriod} {targetType}
              </CardTitle>
              <CardDescription>
                No {targetType} found for this {targetPeriod}
              </CardDescription>
            </div>
            <div>
              <SelectTargetPeriod targetType={targetType} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TargetModal
            edit={false}
            targetType={targetType}
            targetPeriod={targetPeriod}
            currency={currency}
            currencies={currencies}
          />
        </CardContent>
      </Card>
    );
  }

  const currentAmount =
    targetType === 'goal'
      ? await getIncomeForTime(targetPeriod, target.currencyCode)
      : await getExpenseForTime(targetPeriod, target.currencyCode);
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between">
          <div className="space-y-1">
            <CardTitle className="capitalize">
              {targetPeriod} {targetType}
            </CardTitle>
            <CardDescription>{target.name}</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <TargetModal
              edit={true}
              targetType={targetType}
              targetPeriod={targetPeriod}
              currency={currency}
              currencies={currencies}
              target={target}
            />
            <SelectTargetPeriod targetType={targetType} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TargetCardContent target={target} currentAmount={currentAmount} />
      </CardContent>
    </Card>
  );
}
