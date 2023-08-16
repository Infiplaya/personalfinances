import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { transactions } from "@/db/schema/finances";
import { cn, dateFormat, moneyFormat } from "@/lib/utils";
import Link from "next/link";
import { Label } from "./ui/label";

async function getRecentTransactions() {
  return await db.query.transactions.findMany({
    limit: 6,
    with: {
      category: true,
    },
  });
}

export default async function RecentTransactions() {
  const transactions = await getRecentTransactions();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {transactions.map((t) => (
            <Link
              href={`/transactions/${t.id}`}
              key={t.id}
              className="hover:bg-gray-100 text-sm dark:hover:bg-gray-900 block px-2 py-2 rounded-md"
            >
              <li>
                <div className="flex w-full justify-between">
                  <span
                    className={cn(
                      "font-medium text-base",
                      t.type === "expense"
                        ? "text-red-500 dark:text-red-400"
                        : "text-green-500 dark:text-green-400"
                    )}
                  >
                    {moneyFormat(Number(t.quantity))}
                  </span>
                  <span>{dateFormat(t.timestamp as Date)}</span>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
