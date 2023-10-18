'use client';

import { moneyFormat } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import TimeOptions from '../dashboard/time-options';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CardTitleWithTooltip } from '../ui/card-title-with-tooltip';
import { Skeleton } from '../ui/skeleton';

export function BalanceChart({
  data,
  currencyCode,
  balance,
}: {
  data: any;
  currencyCode: string;
  balance: number;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-12">
          <CardTitleWithTooltip message="Your balance  over selected time">
            Balance
          </CardTitleWithTooltip>
          <TimeOptions
            isPending={isPending}
            startTransition={startTransition}
            selectedTime={balance}
            type="balance"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-[350px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              height={350}
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="1" y1="0" x2="1" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${moneyFormat(value, currencyCode)}`}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <ChartTooltip />
              <Area
                type="monotone"
                dataKey="totalBalance"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
