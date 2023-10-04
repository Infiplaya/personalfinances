import MonthSummaryCard from '@/components/dashboard/month-summary-card';
import { getSummariesForMonths } from '@/db/queries/transactions';

export default async function MonthsPage() {
  const monthData = await getSummariesForMonths();

  console.log(monthData);

  return (
    <main>
      <div className="space-y-12">
        {monthData.map((m) => (
          <MonthSummaryCard monthData={m} key={m.month} />
        ))}
      </div>
    </main>
  );
}
