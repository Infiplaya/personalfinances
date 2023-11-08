import { getBalanceData } from '@/db/queries/transactions';
import {Chart} from './chart';

export async function BalanceChart({
  currencyCode,
  balanceTime,
}: {
  currencyCode: string;
  balanceTime: number;
}) {
  const balanceData = await getBalanceData(currencyCode, balanceTime);

  return (
    <Chart
      balanceTime={balanceTime}
      data={balanceData}
      currencyCode={currencyCode}
    />
  );
}
