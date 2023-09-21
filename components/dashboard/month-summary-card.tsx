import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, getMonth, moneyFormat } from '@/lib/utils';
import { Label } from '../ui/label';
import { CardTitleWithTooltip } from './card-title-with-tooltip';

interface Month {
  month: number | undefined;
  totalIncomes: number;
  totalExpenses: number;
  totalBalance: number;
}

export default function MonthlyBalanceCard({
  month,
  currencyCode,
}: {
  month: Month;
  currencyCode: string;
}) {
  

  return null;
}
