import MonthlyBalanceCard from '@/components/dashboard/month-summary-card';
import { getSummariesForMonths } from '@/db/queries/transactions';

export default async function MonthPage() {
  const monthData = await getSummariesForMonths();

  console.log(monthData);

  return (
    <main className="mx-auto py-10">
      {monthData.map((m) => (
        <MonthlyBalanceCard month={m} key={m.month} />
      ))}
    </main>
  );
}
