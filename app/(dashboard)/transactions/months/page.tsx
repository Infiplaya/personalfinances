import MonthSummaryCard from '@/components/dashboard/month-summary-card';
import { getCurrentCurrency } from '@/db/queries/currencies';
import { getSummariesForMonths } from '@/db/queries/transactions';

export default async function MonthsPage() {
  const monthData = await getSummariesForMonths();

  return (
    <main className="mx-auto py-10">
      {monthData.map((m) => (
        <MonthSummaryCard monthData={m} key={m.month} />
      ))}
    </main>
  );
}
