import { BalanceCard } from '@/components/dashboard/balance-card';
import { BalanceChart } from '@/components/dashboard/balance-chart';
import { Overview } from '@/components/dashboard/overview';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import SummaryCard from '@/components/dashboard/summary-card';
import { SuccessToast } from '@/components/success-toast';
import { getCurrentCurrency } from '@/db/queries/currencies';
import { getBalanceData, getOverviewData } from '@/db/queries/transactions';
import { Suspense } from 'react';

export default async function Home() {
  const currencyCode = await getCurrentCurrency();
  const overviewData = getOverviewData(currencyCode);
  const balanceData = getBalanceData(currencyCode);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  const [overview, balance] = await Promise.all([overviewData, balanceData]);

  const currentBalance = balance.slice(-1);

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
          <BalanceCard currentBalance={currentBalance[0].totalBalance} />
        </div>
      </div>
      <div className="grid gap-x-4 lg:grid-cols-6">
        <div className="lg:col-span-4">
          <BalanceChart data={balance} currencyCode={currencyCode} />
        </div>
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
      </div>

      <Overview data={overview} currencyCode={currencyCode} />
    </main>
  );
}
