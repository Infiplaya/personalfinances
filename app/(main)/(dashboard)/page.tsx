import { BalanceCard } from '@/components/balance/balance-card';
import { BalanceChart } from '@/components/balance/balance-chart';
import { Overview } from '@/components/overview/overview';
import RecentTransactions from '@/components/transactions/recent-transactions';
import SummaryCard from '@/components/summaries/summary-card';
import { SuccessToast } from '@/components/ui/success-toast';
import { getCurrentCurrency } from '@/db/queries/currencies';
import { getBalanceData, getOverviewData } from '@/db/queries/transactions';
import { Metadata } from 'next';
import { Cards } from './cards';
import { Suspense } from 'react';
import CardsSkeleton from '@/components/skeletons/cards-skeleton';
import RecentTransactionsSkeleton from '@/components/skeletons/recent-transactions-skeleton';
import BalanceChartSkeleton from '@/components/skeletons/balance-chart-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

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
  const balanceTime =
    typeof searchParams.balance === 'string'
      ? Number(searchParams.balance)
      : 30;
  const overview =
    typeof searchParams.overview === 'string'
      ? Number(searchParams.overview)
      : 7;

  const currencyCode = await getCurrentCurrency();

  return (
    <main className="space-y-12">
      <SuccessToast message="Successfully logged in! Welcome back" />
      <Suspense fallback={<CardsSkeleton />}>
        <Cards currencyCode={currencyCode} />
      </Suspense>
      <div className="grid md:grid-cols-6 md:gap-x-4">
        <div className="md:col-span-4">
          <Suspense fallback={<BalanceChartSkeleton />}>
            <BalanceChart
              balanceTime={balanceTime}
              currencyCode={currencyCode}
            />
          </Suspense>
        </div>
        <div className="mt-12 md:col-span-2 md:mt-0">
          <Suspense fallback={<RecentTransactionsSkeleton />}>
            <RecentTransactions />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<Skeleton className="h-72 w-full" />}>
        <Overview currencyCode={currencyCode} overview={overview} />
      </Suspense>
    </main>
  );
}
