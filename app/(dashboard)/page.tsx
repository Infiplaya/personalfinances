import { BalanceChart } from '@/components/dashboard/balance-chart';
import MonthlyBalanceCard from '@/components/dashboard/month-summary-card';
import { Overview } from '@/components/dashboard/overview';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import SummaryCard from '@/components/dashboard/summary-card';
import { SuccessToast } from '@/components/success-toast';
import { getCurrentCurrency } from '@/db/queries/currencies';
import {
  getBalanceData,
  getOverviewData,
  getTotalIncomeAndExpenses,
} from '@/db/queries/transactions';
import { Suspense } from 'react';

export default async function Home() {
  const currencyCode = await getCurrentCurrency();
  const overviewData = getOverviewData(currencyCode);
  const balanceData = getBalanceData(currencyCode);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentMonthData = getTotalIncomeAndExpenses(currencyCode, currentMonth)

  const [month, overview, balance] = await Promise.all([
    currentMonthData,
    overviewData,
    balanceData,
  ]);

  return (
    <main className="space-y-10 py-10">
      <SuccessToast message="Successfully logged in! Welcome back" />
      <div className="grid-cols-12 gap-x-10 space-y-10 lg:grid lg:space-y-0">
        <div className="lg:col-span-3">
          <Suspense fallback={<div>Loading...</div>}>
            <SummaryCard />
          </Suspense>
        </div>
        <div className="lg:col-span-3">
          <MonthlyBalanceCard month={month} currencyCode={currencyCode} />
        </div>
        <div className="lg:col-span-6">
          <Suspense fallback={<div>Loading...</div>}>
            <RecentTransactions />
          </Suspense>
        </div>
      </div>
      <Overview data={overview} currencyCode={currencyCode} />
      <BalanceChart data={balance} currencyCode={currencyCode} />
    </main>
  );
}
