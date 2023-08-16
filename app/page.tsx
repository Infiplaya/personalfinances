import MonthlyBalanceCard from "@/components/monthly-balance-card";
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
    quantitySum: z.coerce.number(),
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
        quantitySum: sql<number>`sum(${transactions.quantity})`,
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
        quantitySum: sql<number>`sum(${transactions.quantity})`,
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

export type OverviewData = UnwrapPromise<ReturnType<typeof getOverviewData>>;

export default async function Home() {
  const overviewData = await getOverviewData();
  return (
    <main className="container mx-auto w-full">
      <SummaryCard />
      <RecentTransactions />
      <MonthlyBalanceCard />
      <Overview data={overviewData} />
    </main>
  );
}
