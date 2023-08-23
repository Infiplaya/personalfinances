import { BalanceChart } from '@/components/dashboard/balance-chart';
import MonthlyBalanceCard from '@/components/dashboard/month-summary-card';
import { Overview } from '@/components/dashboard/overview';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import SummaryCard from '@/components/dashboard/summary-card';
import { SuccessToast } from '@/components/success-toast';
import {
  getBalanceData,
  getBalanceForMonth,
  getOverviewData,
} from '@/db/queries/transactions';
import { authOptions } from '@/lib/auth/auth';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

export default async function Home() {
  const session = await getServerSession(authOptions);
  const overviewData = await getOverviewData(session?.user.id as string);
  const balanceData = await getBalanceData(session?.user.id as string);

  const currentMonth = new Date().getMonth();

  const currentMonthData = await getBalanceForMonth(
    session?.user.id as string,
  );


  return (
    <main className="space-y-10 py-10">
      <SuccessToast message="Successfully logged in! Welcome back" />
      <div className="grid-cols-12 gap-x-10 space-y-10 lg:grid lg:space-y-0">
        <div className="lg:col-span-3">
          <SummaryCard />
        </div>
        <div className="lg:col-span-3">
          <MonthlyBalanceCard month={currentMonthData} />
        </div>
        <div className="lg:col-span-6">
          <RecentTransactions />
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}> 
      <Overview data={overviewData} />
      <BalanceChart data={balanceData} />
      </Suspense>
      
    </main>
  );
}
