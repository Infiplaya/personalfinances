import { BalanceCard } from '@/components/balance/balance-card';
import { SummaryCard } from '@/components/summaries/summary-card';

export function Cards({ currencyCode }: { currencyCode: string }) {
  return (
    <div className="mt-6 grid-cols-12 gap-x-4 space-y-6 md:mt-0 md:grid md:space-y-0">
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
