import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { transactions } from "@/db/schema/finances";
import { cn, moneyFormat } from "@/lib/utils";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { Label } from "./ui/label";

async function getBalanceForMonth(month?: number) {
  const currentDate = new Date();
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    month ? month : currentDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    month ? month : currentDate.getMonth() + 1,
    0
  );

  return await db.transaction(async (tx) => {
    const [totalIncome] = await tx
      .select({
        totalIncome: sql<number>`sum(${transactions.quantity})`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.type, "income"),
          gte(transactions.timestamp, startOfMonth),
          lte(transactions.timestamp, endOfMonth)
        )
      );

    const [totalExpenses] = await tx
      .select({
        totalExpenses: sql<number>`sum(${transactions.quantity})`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.type, "expense"),
          gte(transactions.timestamp, startOfMonth),
          lte(transactions.timestamp, endOfMonth)
        )
      );

    return {
      totalIncome: totalIncome.totalIncome,
      totalExpenses: totalExpenses.totalExpenses,
    };
  });
}

export default async function MonthlyBalanceCard() {
  const { totalIncome, totalExpenses } = await getBalanceForMonth();
  const totalBalance = totalIncome - totalExpenses;
  return (
    <Card>
      <CardHeader>
        <CardTitle>This Month</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label>Income</Label>
          <p className="text-lg font-semibold">{moneyFormat(totalIncome)}</p>
        </div>
        <div>
          <Label>Expenses</Label>
          <p className="text-lg font-semibold">{moneyFormat(totalExpenses)}</p>
        </div>
        <div>
          <Label>Balance</Label>
          <p
            className={cn(
              "text-lg font-semibold",
              totalBalance > 0 ? "text-green-500" : "text-red-500"
            )}
          >
            {moneyFormat(totalBalance)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
