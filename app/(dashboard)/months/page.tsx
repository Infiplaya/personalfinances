import MonthSummaryCard from '@/components/summaries/month-summary-card';
import { Skeleton } from '@/components/ui/skeleton';
import { getSummariesForMonths } from '@/db/queries/transactions';
import { Suspense } from 'react';

export default async function MonthsPage() {
  const monthData = await getSummariesForMonths();
  return (
    <main>
      <div className="grid gap-12 md:grid-cols-2">
        {monthData.map((m) => (
          <MonthSummaryCard monthData={m} key={m.month} />
        ))}
      </div>
    </main>
  );
}
