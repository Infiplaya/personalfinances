import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CardTitleWithTooltip } from './card-title-with-tooltip';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { moneyFormat } from '@/lib/utils';
import { OverviewData } from '@/db/queries/transactions';

export function OverviewCard({
  data,
  dataKey,
  currencyCode,
  title,
  message,
}: {
  data: OverviewData;
  currencyCode: string;
  dataKey: string;
  title: string;
  message: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitleWithTooltip message={message}>
          <CardTitle>{title}</CardTitle>
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
              dataKey={dataKey}
              fill={title == 'Expenses' ? '#F4364C' : '#39E75F'}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
