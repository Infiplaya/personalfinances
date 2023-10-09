import { BalanceCard } from '@/components/balance/balance-card';
import { BalanceChart } from '@/components/balance/balance-chart';
import { Overview } from '@/components/overview/overview';
import RecentTransactions from '@/components/transactions/recent-transactions';
import SummaryCard from '@/components/summaries/summary-card';
import { SuccessToast } from '@/components/ui/success-toast';
import { getCurrentCurrency } from '@/db/queries/currencies';
import { getBalanceData, getOverviewData } from '@/db/queries/transactions';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const currentDate = new Date();
const currentMonth = currentDate.getMonth();

export default async function Home() {
  const currencyCode = await getCurrentCurrency();
  const overviewData = await getOverviewData(currencyCode);
  const balanceData = await getBalanceData(currencyCode);

  return (
    <main className="space-y-12">
      <SuccessToast message="Successfully logged in! Welcome back" />
      <div className="grid-cols-12 gap-x-4 space-y-10 lg:grid lg:space-y-0">
        <div className="lg:col-span-4">
          <Suspense fallback={<Skeleton className="h-[268px] w-full" />}>
            <SummaryCard />
          </Suspense>
        </div>
        <div className="lg:col-span-4">
          <Suspense fallback={<Skeleton className="h-[268px] w-full" />}>
            <SummaryCard currentMonth={currentMonth} />
          </Suspense>
        </div>
        <div className="lg:col-span-4">
          <Suspense fallback={<Skeleton className="h-[268px] w-full" />}>
            <BalanceCard currentBalance={0} />
          </Suspense>
        </div>
      </div>
      <div className="grid gap-x-4 lg:grid-cols-6">
        <div className="lg:col-span-4">
          <Suspense fallback={<Skeleton className="h-[420px] w-full" />}>
            <BalanceChart data={balanceData} currencyCode={currencyCode} />
          </Suspense>
        </div>
        <div className="mt-12 lg:col-span-2 lg:mt-0">
          <Suspense fallback={<Skeleton className="h-[420px] w-full" />}>
            <RecentTransactions />
          </Suspense>
        </div>
      </div>

      <Overview data={overviewData} currencyCode={currencyCode} />
    </main>
  );
}
