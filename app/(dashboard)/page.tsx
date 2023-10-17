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

export default async function Home() {
  const currencyCode = await getCurrentCurrency();
  const overviewData = await getOverviewData(currencyCode);
  const balanceData = await getBalanceData(currencyCode);

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
          <BalanceChart data={balanceData} currencyCode={currencyCode} />
        </div>
        <div className="mt-12 lg:col-span-2 lg:mt-0">
          <RecentTransactions />
        </div>
      </div>
      <Overview data={overviewData} currencyCode={currencyCode} />
    </main>
  );
}
