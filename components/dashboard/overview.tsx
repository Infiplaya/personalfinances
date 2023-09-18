'use client';

import { OverviewData } from '@/db/queries/transactions';
import { moneyFormat } from '@/lib/utils';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CardTitleWithTooltip } from './card-title-with-tooltip';

export function Overview({
  data,
  currencyCode,
}: {
  data: OverviewData;
  currencyCode: string;
}) {
  console.log(data);
  return (
    <div className="space-y-10 lg:flex lg:gap-10 lg:space-y-0">
      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitleWithTooltip message="Your incomes in last 7 days.">
              <CardTitle>Incomes</CardTitle>
            </CardTitleWithTooltip>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
                <XAxis
                  dataKey="day"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    `${moneyFormat(value, currencyCode)}`
                  }
                />
                <Bar
                  dataKey="totalIncome"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitleWithTooltip message="Your spendings in last 7 days.">
              <CardTitle>Spendings</CardTitle>
            </CardTitleWithTooltip>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
                <XAxis
                  dataKey="day"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Bar
                  dataKey="totalExpenses"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
