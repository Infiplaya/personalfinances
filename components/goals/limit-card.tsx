import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import ProgressCircle from '../ui/progress-bar';

export async function LimitCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Daily Limit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-2 flex items-center space-x-8">
          <ProgressCircle value={75} size="lg">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              75%
            </span>
          </ProgressCircle>
          <div>
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              750$/1000$
            </h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              You are moving close to your daily spending limit
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
