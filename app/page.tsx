import { BalanceChart } from "@/components/balance-chart";
import MonthlyBalanceCard from "@/components/month-summary-card";
import { Overview } from "@/components/overview";
import RecentTransactions from "@/components/recent-transactions";
import SummaryCard from "@/components/summary-card";
import { db } from "@/db";
import { balances, transactions } from "@/db/schema/finances";
import { authOptions } from "@/lib/auth/auth";
import { UnwrapPromise } from "@/lib/utils";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";

async function getOverviewData(userId: string) {
  const currentDate = new Date();
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - 7);

  return await db.transaction(async (tx) => {
    const spendings = await tx
      .select({
        day_of_week: sql<string>`weekday(${transactions.timestamp})`,
        amountSum: sql<number>`sum(${transactions.amount})`,
      })
      .from(transactions)
      .where(
        and(
          gte(transactions.timestamp, sevenDaysAgo),
          lte(transactions.timestamp, currentDate),
          eq(transactions.type, "expense"),
          eq(transactions.userId, userId)
        )
      )
      .groupBy(sql`weekday(${transactions.timestamp})`);

    const incomes = await tx
      .select({
        day_of_week: sql<string>`weekday(${transactions.timestamp})`,
        amountSum: sql<number>`sum(${transactions.amount})`,
      })
      .from(transactions)
      .where(
        and(
          gte(transactions.timestamp, sevenDaysAgo),
          lte(transactions.timestamp, currentDate),
          eq(transactions.type, "income"),
          eq(transactions.userId, userId)
        )
      )
      .groupBy(sql`weekday(${transactions.timestamp})`);

    return {
      incomes,
      spendings,
    };
  });
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
    <main className="container mx-auto w-full space-y-10 py-10">
      <div className="lg:grid grid-cols-8 gap-x-10">
        <div className="lg:col-span-2">
          {/* @ts-expect-error Server Component */}
          <SummaryCard />
        </div>
        <div className="lg:col-span-2">
          {/* @ts-expect-error Server Component */}
          <MonthlyBalanceCard />
        </div>
        <div className="lg:col-span-4">
          {/* @ts-expect-error Server Component */}
          <RecentTransactions />
        </div>
      </div>
      <Overview data={overviewData} />
      <BalanceChart data={balanceData} />
    </main>
  );
}
