import MonthlyBalanceCard from '@/components/dashboard/month-summary-card';
import { getUserPrefferedCurrency } from '@/db/queries/currencies';
import { getSummariesForMonths } from '@/db/queries/transactions';

export default async function MonthPage() {
  const monthData = await getSummariesForMonths();
  const currentCurrency = await getUserPrefferedCurrency();

  return (
    <main className="mx-auto py-10">
      {monthData.map((m) => (
        <MonthlyBalanceCard month={m} key={m.month} currencyCode={currentCurrency} />
      ))}
    </main>
  );
}
