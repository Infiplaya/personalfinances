import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { transactions } from "@/db/schema/finances";
import { authOptions } from "@/lib/auth/auth";
import { cn, moneyFormat } from "@/lib/utils";
import { eq, sql } from "drizzle-orm";
import { Info } from "lucide-react";
import { getServerSession } from "next-auth";
import { Label } from "./ui/label";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

async function getTotalIncomeAndExpenses(userId: string) {
  const result = await db
    .select({
      totalIncome: sql<number>`sum(CASE WHEN transactions.type = 'income' THEN transactions.amount ELSE 0 END)`,
      totalExpenses: sql<number>`sum(CASE WHEN transactions.type = 'expense' THEN transactions.amount ELSE 0 END)`,
    })
    .from(transactions)
    .where(eq(transactions.userId, userId));

  return {
    totalExpenses: result[0].totalExpenses,
    totalIncome: result[0].totalIncome,
    totalBalance:
      Number(result[0].totalIncome) - Number(result[0].totalExpenses),
  };
}

export default async function SummaryCard() {
  const session = await getServerSession(authOptions);
  const { totalExpenses, totalIncome, totalBalance } =
    await getTotalIncomeAndExpenses(session?.user.id as string);
  return (
    <Card>
      <CardHeader>
        <div className="inline-flex space-x-4">
          <CardTitle>Summary </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Summary of all your transactions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
              totalBalance > 0
                ? "text-green-500 dark:text-green-400"
                : "text-red-500 dark:text-red-400"
            )}
          >
            {moneyFormat(totalBalance)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
