'use client';

import { FinancialTarget } from '@/db/schema/finances';
import { moneyFormat } from '@/lib/utils';
import { useMemo } from 'react';
import ProgressCircle from '../ui/progress-bar';

export function TargetCardContent({
  target,
  income,
  expense,
}: {
  target: FinancialTarget;
  income?: number | null;
  expense?: number | null;
}) {
  const percentage = useMemo(() => {
    if (income) {
      return Math.floor((income * 100) / target.amount);
    } else if (expense) {
      return Math.floor((expense * 100) / target.amount);
    } else {
      return 0;
    }
  }, [income, target, expense]);

  const message = generateFinancialMessage(target.type, percentage);
  return (
    <div className="mt-2 flex items-center space-x-8">
      <ProgressCircle value={percentage} targetType={target.type} size="md">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {percentage}%
        </span>
      </ProgressCircle>
      <div>
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          {moneyFormat(expense ? expense : income!, target.currencyCode)} /{' '}
          {moneyFormat(target.amount, target.currencyCode)}
        </h3>
        <p className="text-sm text-neutral-700 dark:text-neutral-300">
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