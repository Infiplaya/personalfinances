import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import ProgressCircle from '../ui/progress-bar';

export async function GoalCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Daily Goal</CardTitle>
        <CardDescription>Earn 20 dollars</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-2 flex items-center space-x-8">
          <ProgressCircle value={25} size="lg">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              25%
            </span>
          </ProgressCircle>
          <div>
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              5$/20$
            </h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Keep it up. You can do it!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
