'use client';
import { Card, CardContent, CardHeader } from '../ui/card';
import { CardTitleWithTooltip } from '../ui/card-title-with-tooltip';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { moneyFormat } from '@/lib/utils';
import { useTransition } from 'react';
import { Skeleton } from '../ui/skeleton';
import TimeOptions from '../dashboard/time-options';
import { OverviewData } from '@/db/queries/transactions';

export default function OverviewChart({
  data,
  currencyCode,
  overview,
}: {
  data: OverviewData;
  currencyCode: string;
  overview: number;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitleWithTooltip
            message={'Your incomes and expenses in last 7 days'}
          >
            Incomes and Expenses
          </CardTitleWithTooltip>
          <TimeOptions
            isPending={isPending}
            startTransition={startTransition}
            selectedTime={overview}
            type="overview"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-[350px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${moneyFormat(value, currencyCode)}`}
              />
              <Bar
                dataKey={'totalExpenses'}
                fill={'#F4364C'}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey={'totalIncome'}
                fill={'#39E75F'}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
