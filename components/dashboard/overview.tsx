'use client';

import { OverviewData } from '@/db/queries/transactions';
import { moneyFormat } from '@/lib/utils';

import { CardTitleWithTooltip } from './card-title-with-tooltip';
import { OverviewCard } from './overview-card';

export function Overview({
  data,
  currencyCode,
}: {
  data: OverviewData;
  currencyCode: string;
}) {
  return (
    <div className="space-y-10 lg:flex lg:gap-10 lg:space-y-0">
      <div className="flex-1">
        <OverviewCard
          data={data}
          currencyCode={currencyCode}
          dataKey="totalExpenses"
          title='Expenses'
          message='Your expenses in last 7 days'
        />
      </div>
      <div className="flex-1">
        <OverviewCard
          data={data}
          currencyCode={currencyCode}
          dataKey="totalIncome"
          title='Incomes'
          message='Your incomes in last 7 days'
        />
      </div>
    </div>
  );
}
