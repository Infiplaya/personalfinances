import { TransactionsToast } from "@/components/transactions-toast";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { Transaction, transactions } from "@/db/schema/finances";
import { like, sql } from "drizzle-orm";
import Link from "next/link";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

type Column =
  | "id"
  | "name"
  | "description"
  | "quantity"
  | "userId"
  | "categoryId"
  | "type"
  | "timestamp"
  | undefined;
type Order = "asc" | "desc" | undefined;

async function getTransactions(
  limit: number,
  offset: number,
  name: string | string[] | undefined,
  column: Column,
  order: Order
) {
  return await db.query.transactions.findMany({
    limit: limit,
    offset: offset,
    where: (transactions) => {
      if (typeof name === "string") {
        return like(transactions.name, `%${name}%`);
      } else {
        return undefined;
      }
    },
    orderBy: (transactions, { asc, desc }) => {
      if (column && column in transactions) {
        if (order === "asc") {
          return [asc(transactions[column])];
        } else {
          return [desc(transactions[column])];
        }
      } else {
        return [desc(transactions.id)];
      }
    },
    // with: {
    //   category: true,
    // },
  });
}

async function countTransactions() {
  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactions);

  return count[0].count;
}

export default async function TransactionsPage({ searchParams }: Props) {
  const page = searchParams["page"] ?? "1";
  const per_page = searchParams["per_page"] ?? "10";
  const name = searchParams["name"];
  const sort = searchParams["sort"];

  const limit = typeof per_page === "string" ? Number(per_page) : 1;
  const offset =
    typeof page === "string"
      ? Number(page) > 0
        ? (Number(page) - 1) * limit
        : 0
      : 0;

  const [column, order] =
    typeof sort === "string"
      ? (sort.split(".") as [
          keyof Transaction | undefined,
          "asc" | "desc" | undefined
        ])
      : [];

  const transactions = await getTransactions(
    limit,
    offset,
    name,
    column,
    order
  );
  const transactionsCount = await countTransactions();

  return (
    <div className="container mx-auto py-10">
      <TransactionsToast />
      <div className="w-full my-6 flex justify-end">
        <Link href="/transactions/new">
          <Button>New Transaction</Button>
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={transactions}
        count={transactionsCount}
      />
    </div>
  );
}
