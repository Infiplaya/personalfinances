import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";
import { transactions } from "@/db/schema/finances";
import { cn, moneyFormat } from "@/lib/utils";
import { asc, eq, sql } from "drizzle-orm";
import { Label } from "./ui/label";

async function getTotalIncomeAndExpenses() {
  return await db.transaction(async (tx) => {
    const [totalIncome] = await tx
      .select({
        totalIncome: sql<number>`sum(${transactions.quantity})`,
      })
      .from(transactions)
      .where(eq(transactions.type, "income"));
    const [totalExpenses] = await tx
      .select({
        totalExpenses: sql<number>`sum(${transactions.quantity})`,
      })
      .from(transactions)
      .where(eq(transactions.type, "expense"));

    return {
      totalIncome: totalIncome.totalIncome,
      totalExpenses: totalExpenses.totalExpenses,
    };
  });
}

export default async function SummaryCard() {
  const { totalIncome, totalExpenses } = await getTotalIncomeAndExpenses();
  const totalBalance = totalIncome - totalExpenses;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
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
