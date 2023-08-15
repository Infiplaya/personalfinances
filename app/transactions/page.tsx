import { db } from "@/db";
import { transactions } from "@/db/schema/finances";
import { sql } from "drizzle-orm";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import PaginationControls from "./data-table-pagination";

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

async function getTransactions(limit: number, offset: number) {
  return await db.query.transactions.findMany({
    limit: limit,
    offset: offset,
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
  const per_page = searchParams["per_page"] ?? "5";

  const limit = typeof per_page === "string" ? Number(per_page) : 1;
  const offset =
    typeof page === "string"
      ? Number(page) > 0
        ? (Number(page) - 1) * limit
        : 0
      : 0;

  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);

  const transactions = await getTransactions(limit, offset);
  const transactionsCount = await countTransactions();
  const totalPages = Math.ceil(transactionsCount / Number(per_page));

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={transactions} />
      <PaginationControls
        hasNextPage={end < transactionsCount}
        hasPrevPage={start > 0}
        totalPages={totalPages}
      />
    </div>
  );
}
