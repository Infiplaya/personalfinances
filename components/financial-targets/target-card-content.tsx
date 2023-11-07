'use client';

import { FinancialTarget } from '@/db/schema/finances';
import { moneyFormat } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { useMemo } from 'react';
import ProgressCircle from '../ui/progress-bar';

export function TargetCardContent({
  target,
  currentAmount,
}: {
  target: FinancialTarget;
  currentAmount: number;
}) {
  const percentage = useMemo(() => {
    return Math.floor((currentAmount * 100) / target.amount);
  }, [target, currentAmount]);

  const message = generateFinancialMessage(target.type, percentage);
  return (
    <div className="mt-2 flex items-center space-x-8">
      <ProgressCircle value={percentage} targetType={target.type} size="md">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {percentage > 100 ? (
            target.type === 'limit' ? (
              <X className="h-5 w-5 text-red-400" />
            ) : (
              <Check className="h-5 w-5 text-green-400" />
            )
          ) : (
            `${percentage}%`
          )}
        </span>
      </ProgressCircle>
      <div>
        <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 md:text-lg">
          {moneyFormat(currentAmount, target.currencyCode)} /{' '}
          {moneyFormat(target.amount, target.currencyCode)}
        </h3>
        <p className="hidden text-sm text-neutral-700 dark:text-neutral-300 md:block">
          {message}
        </p>
      </div>
    </div>
  );
}

function generateFinancialMessage(
  targetType: 'goal' | 'limit',
  percentage: number
): string {
  if (targetType === 'goal') {
    if (percentage >= 100) {
      return 'Congratulations! You have achieved your financial goal.';
    } else if (percentage >= 80) {
      return 'You are getting close to reaching your financial goal. Keep it up!';
    } else {
      return 'You are making progress towards your financial goal.';
    }
  } else if (targetType === 'limit') {
    if (percentage >= 100) {
      return 'Warning: You have exceeded your financial limit!';
    } else if (percentage >= 80) {
      return 'You are going close to exceeding a limit. Be cautious with your spending.';
    } else {
      return 'You are well within your financial limit. Keep managing your expenses wisely.';
    }
  } else {
    return "Invalid financial target type. Please provide 'goal' or 'limit'.";
  }
}
