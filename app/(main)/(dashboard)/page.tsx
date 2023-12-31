import { BalanceChart } from '@/components/balance/balance-chart';
import { Overview } from '@/components/overview/overview';
import RecentTransactions from '@/components/transactions/recent-transactions';
import { SuccessToast } from '@/components/ui/success-toast';
import { Metadata } from 'next';
import { Cards } from './cards';
import { Suspense } from 'react';
import { CardsSkeleton } from '@/components/skeletons/cards-skeleton';
import { RecentTransactionsSkeleton } from '@/components/skeletons/recent-transactions-skeleton';
import { BalanceChartSkeleton } from '@/components/skeletons/balance-chart-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { getTransactionFormData } from '@/db/queries/transactions';
import { TargetCard } from '@/components/financial-targets/target-card';
import { TimePeriod } from '@/db/queries/targets';

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

  const goalPeriod =
    typeof searchParams.goalPeriod === 'string'
      ? searchParams.goalPeriod
      : 'day';

  const limitPeriod =
    typeof searchParams.limitPeriod === 'string'
      ? searchParams.limitPeriod
      : 'day';

  const { currentCurrency } = await getTransactionFormData();

  return (
    <div>
      <SuccessToast message="Welcome back!" />
      <Suspense fallback={<CardsSkeleton />}>
        <Cards currencyCode={currentCurrency} />
      </Suspense>
      <div className="mt-6 flex flex-col-reverse lg:mt-0 lg:flex-col">
        <div className="my-6 space-y-6 xl:grid xl:grid-cols-6 xl:gap-x-4 xl:space-y-0">
          <div className="xl:col-span-4">
            <Suspense fallback={<BalanceChartSkeleton />}>
              <BalanceChart
                balanceTime={balanceTime}
                currencyCode={currentCurrency}
              />
            </Suspense>
          </div>
          <div className="xl:col-span-2 xl:mt-0">
            <Suspense fallback={<RecentTransactionsSkeleton />}>
              <RecentTransactions />
            </Suspense>
          </div>
        </div>
        <section className="flex flex-col-reverse gap-6 xl:flex-row xl:items-stretch">
          <div className="flex-1">
            <Suspense fallback={<Skeleton className="h-72 w-full" />}>
              <Overview currencyCode={currentCurrency} overview={overview} />
            </Suspense>
          </div>
          <div className="flex flex-1 flex-col justify-stretch gap-6">
            <Suspense fallback={<Skeleton className="h-36 w-full" />}>
              <TargetCard
                targetPeriod={goalPeriod as TimePeriod}
                targetType="goal"
              />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-36 w-full" />}>
              <TargetCard
                targetPeriod={limitPeriod as TimePeriod}
                targetType="limit"
              />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
}
