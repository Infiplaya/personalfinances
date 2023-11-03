import { BalanceCard } from '@/components/balance/balance-card';
import SummaryCard from '@/components/summaries/summary-card';

export function Cards({ currencyCode }: { currencyCode: string }) {
  return (
    <div className="grid-cols-12 gap-x-4 space-y-6 md:space-y-0 md:grid">
      <div className="lg:col-span-4">
        <SummaryCard isCurrentMonth={true} currentCurrency={currencyCode} />
      </div>
      <div className="lg:col-span-4">
        <SummaryCard currentCurrency={currencyCode} />
      </div>
      <div className="lg:col-span-4">
        <BalanceCard currencyCode={currencyCode} />
      </div>
    </div>
  );
}
