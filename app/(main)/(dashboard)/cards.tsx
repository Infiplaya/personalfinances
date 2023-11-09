import { BalanceCard } from '@/components/balance/balance-card';
import { SummaryCard } from '@/components/summaries/summary-card';

export function Cards({ currencyCode }: { currencyCode: string }) {
  return (
    <div className="mt-6 lg:mt-0 space-y-6 lg:grid lg:grid-cols-3 lg:space-y-0 lg:gap-6">
      <div className="lg:col-span-1">
        <SummaryCard isCurrentMonth={true} currentCurrency={currencyCode} />
      </div>
      <div className="lg:col-span-1">
        <SummaryCard currentCurrency={currencyCode} />
      </div>
      <div className="lg:col-span-1">
        <BalanceCard currencyCode={currencyCode} />
      </div>
    </div>
  );
}
