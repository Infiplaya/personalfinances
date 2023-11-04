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
import { NewTargetModal } from './new-target-modal';
import { SelectTargetPeriod } from './select-period';
import { TargetCardContent } from './target-card-content';
import { TargetForm } from './target-form';

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
  const currentAmount =
    targetType === 'goal'
      ? await getIncomeForTime(targetPeriod, currency)
      : await getExpenseForTime(targetPeriod, currency);
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
          <NewTargetModal>
            <TargetForm
              type={targetType}
              timePeriod={targetPeriod}
              currentCurrency={currency}
              currencies={currencies}
            />
          </NewTargetModal>
        </CardContent>
      </Card>
    );
  }
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
          <div>
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
