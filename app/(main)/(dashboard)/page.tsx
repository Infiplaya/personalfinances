import { BalanceCard } from '@/components/balance/balance-card';
import { BalanceChart } from '@/components/balance/balance-chart';
import { Overview } from '@/components/overview/overview';
import RecentTransactions from '@/components/transactions/recent-transactions';
import SummaryCard from '@/components/summaries/summary-card';
import { SuccessToast } from '@/components/ui/success-toast';
import { getCurrentCurrency } from '@/db/queries/currencies';
import { getBalanceData, getOverviewData } from '@/db/queries/transactions';
import { Metadata } from 'next';

const currentDate = new Date();
const currentMonth = currentDate.getMonth();

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard of personal finances app',
};

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function Home({ searchParams }: Props) {
  const balance =
    typeof searchParams.balance === 'string'
      ? Number(searchParams.balance)
      : 30;
  const overview =
    typeof searchParams.overview === 'string'
      ? Number(searchParams.overview)
      : 7;

  const currencyCode = await getCurrentCurrency();
  const overviewData = await getOverviewData(currencyCode, overview);
  const balanceData = await getBalanceData(currencyCode, balance);

  return (
    <main className="space-y-12">
      <SuccessToast message="Successfully logged in! Welcome back" />
      <div className="grid-cols-12 gap-x-4 space-y-10 lg:grid lg:space-y-0">
        <div className="lg:col-span-4">
          <SummaryCard />
        </div>
        <div className="lg:col-span-4">
          <SummaryCard currentMonth={currentMonth} />
        </div>
        <div className="lg:col-span-4">
          <BalanceCard currentBalance={0} />
        </div>
      </div>
      <div className="grid gap-x-4 lg:grid-cols-6">
        <div className="lg:col-span-4">
          <BalanceChart
            data={balanceData}
            balance={balance}
            currencyCode={currencyCode}
          />
        </div>
        <div className="mt-12 lg:col-span-2 lg:mt-0">
          <RecentTransactions />
        </div>
      </div>
      <Overview
        data={overviewData}
        currencyCode={currencyCode}
        overview={overview}
      />
    </main>
  );
}
