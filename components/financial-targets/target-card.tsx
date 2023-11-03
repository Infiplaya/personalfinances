import { getTarget, TargetType, TimePeriod } from '@/db/queries/targets';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
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
  if (!target) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex justify-between">
            <div className="space-y-1">
              <CardTitle>Daily {targetType}</CardTitle>
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
          <Button>Create New</Button>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Daily {targetType}</CardTitle>
        <CardDescription>{target.name}</CardDescription>
        <SelectTargetPeriod targetType={targetType} />
      </CardHeader>
      <CardContent>
        <TargetCardContent />
      </CardContent>
    </Card>
  );
}
