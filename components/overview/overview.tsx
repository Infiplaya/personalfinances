import { getOverviewData } from '@/db/queries/transactions';
import { OverviewChart } from './overview-chart';

export async function Overview({
  currencyCode,
  overview,
}: {
  currencyCode: string;
  overview: number;
}) {
  const overviewData = await getOverviewData(currencyCode, overview);
  return (
    <OverviewChart
      data={overviewData}
      currencyCode={currencyCode}
      overview={overview}
    />
  );
}
