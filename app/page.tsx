import RecentTransactions from "@/components/recent-transactions";
import SummaryCard from "@/components/summary-card";
import { Toaster } from "sonner";

export default async function Home() {
  return (
    <main className="max-w-lg mx-auto py-24">
      great emptiness
      <SummaryCard />
      <RecentTransactions />
    </main>
  );
}
