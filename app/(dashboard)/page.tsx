import { BalanceChart } from "@/components/balance-chart";
import MonthlyBalanceCard from "@/components/month-summary-card";
import { Overview } from "@/components/overview";
import RecentTransactions from "@/components/recent-transactions";
import SummaryCard from "@/components/summary-card";
import { SuccessToast } from "@/components/success-toast";
import { db } from "@/db";
import { balances, transactions } from "@/db/schema/finances";
import { authOptions } from "@/lib/auth/auth";
import { getDayOfWeek, UnwrapPromise } from "@/lib/utils";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { z } from "zod";

const overviewSchema = z.array(
  z.object({
    totalIncome: z.string(),
    totalExpenses: z.string(),
    day: z.number().transform((val) => getDayOfWeek(val)),
  })
);

async function getOverviewData(userId: string) {
  const currentDate = new Date();
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - 7);

  const result = await db
    .select({
      day: sql<number>`weekday(${transactions.timestamp})`,
      totalIncome: sql<number>`sum(CASE WHEN transactions.type = 'income' THEN transactions.amount ELSE 0 END)`,
      totalExpenses: sql<number>`sum(CASE WHEN transactions.type = 'expense' THEN transactions.amount ELSE 0 END)`,
    })
    .from(transactions)
    .where(
      and(
        gte(transactions.timestamp, sevenDaysAgo),
        lte(transactions.timestamp, currentDate),
        eq(transactions.userId, userId)
      )
    )
    .groupBy(sql`weekday(${transactions.timestamp})`);

  return overviewSchema.parse(result);
}

async function getBalanceData(userId: string) {
  const currentDate = new Date();
  let monthAgo = new Date(currentDate);
  monthAgo.setDate(currentDate.getDate() - 30);

  return await db
    .select({
      totalBalance: sql<number>`${balances.totalBalance}`,
      date: sql<string>`date(${balances.timestamp})`,
    })
    .from(balances)
    .where(
      and(
        gte(balances.timestamp, monthAgo),
        lte(balances.timestamp, currentDate),
        eq(balances.userId, userId)
      )
    );
}

export type OverviewData = UnwrapPromise<ReturnType<typeof getOverviewData>>;

export default async function Home() {
  const session = await getServerSession(authOptions);
  const overviewData = await getOverviewData(session?.user.id as string);
  const balanceData = await getBalanceData(session?.user.id as string);
  return (
    <main className="py-10 space-y-10">
      <SuccessToast message="Successfully logged in! Welcome back" />
      <div className="lg:grid grid-cols-12 gap-x-10">
        <div className="lg:col-span-3">
          {/* @ts-expect-error Server Component */}
          <SummaryCard />
        </div>
        <div className="lg:col-span-3">
          {/* @ts-expect-error Server Component */}
          <MonthlyBalanceCard />
        </div>
        <div className="lg:col-span-6">
          {/* @ts-expect-error Server Component */}
          <RecentTransactions />
        </div>
      </div>
      <Overview data={overviewData} />
      <BalanceChart data={balanceData} />
    </main>
  );
}
