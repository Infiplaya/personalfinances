'use client';

import { OverviewData } from '@/db/queries/transactions';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CardTitleWithTooltip } from '../ui/card-title-with-tooltip';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { moneyFormat } from '@/lib/utils';

export function Overview({
  data,
  currencyCode,
}: {
  data: OverviewData;
  currencyCode: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitleWithTooltip
          message={'Your incomes and expenses in last 7 days'}
        >
          <CardTitle>Incomes and Expenses</CardTitle>
        </CardTitleWithTooltip>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
