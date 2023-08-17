import { BalanceChart } from "@/components/balance-chart";
import MonthlyBalanceCard from "@/components/month-summary-card";
import { Overview } from "@/components/overview";
import RecentTransactions from "@/components/recent-transactions";
import SummaryCard from "@/components/summary-card";
import { db } from "@/db";
import { transactions } from "@/db/schema/finances";
import { getDayOfWeek, UnwrapPromise } from "@/lib/utils";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { z } from "zod";

const transactionsSchema = z.array(
  z.object({
    day_of_week: z.number().transform((val) => getDayOfWeek(val)),
    amountSum: z.coerce.number().transform((val) => (val < 0 ? -val : val)),
  })
);

async function getOverviewData() {
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
          eq(transactions.type, "expense")
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
          eq(transactions.type, "income")
        )
      )
      .groupBy(sql`weekday(${transactions.timestamp})`);

    return {
      incomes: transactionsSchema.parse(incomes),
      spendings: transactionsSchema.parse(spendings),
    };
  });
}

async function getBalanceData() {
  const currentDate = new Date();
  let monthAgo = new Date(currentDate);
  monthAgo.setDate(currentDate.getDate() - 30);

  return await db
    .select({
      date: sql<string>`date(${transactions.timestamp})`,
    })
    .from(transactions)
    .where(
      and(
        gte(transactions.timestamp, monthAgo),
        lte(transactions.timestamp, currentDate)
      )
    )
    .groupBy(sql`date(${transactions.timestamp})`)
    .orderBy(sql`date(${transactions.timestamp})`);
}

export type OverviewData = UnwrapPromise<ReturnType<typeof getOverviewData>>;

export default async function Home() {
  const overviewData = await getOverviewData();
  const balance = await getBalanceData();
  return (
    <main className="container mx-auto w-full space-y-10 py-10">
      <div className="lg:grid grid-cols-8 gap-x-10">
        <div className="lg:col-span-2">
          <SummaryCard />
        </div>
        <div className="lg:col-span-2">
          <MonthlyBalanceCard />
        </div>
        <div className="lg:col-span-4">
          <RecentTransactions />
        </div>
      </div>
      <Overview data={overviewData} />
      <BalanceChart />
    </main>
  );
}
