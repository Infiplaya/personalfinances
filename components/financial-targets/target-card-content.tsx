'use client';

import { FinancialTarget } from '@/db/schema/finances';
import { moneyFormat } from '@/lib/utils';
import { useMemo } from 'react';
import ProgressCircle from '../ui/progress-bar';

export function TargetCardContent({
  target,
  income,
}: {
  target: FinancialTarget;
  income: number;
}) {
  const percentage = useMemo(() => {
    return Math.floor((income * 100) / target.amount);
  }, [income, target]);
  return (
    <div className="mt-2 flex items-center space-x-8">
      <ProgressCircle value={percentage} size="lg">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {percentage}%
        </span>
      </ProgressCircle>
      <div>
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          {moneyFormat(income, target.currencyCode)} /{' '}
          {moneyFormat(target.amount, target.currencyCode)}
        </h3>
        <p className="text-sm text-neutral-700 dark:text-neutral-300">
          Keep it up. You can do it!
        </p>
      </div>
    </div>
  );
}
