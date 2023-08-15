import { db } from "@/db";
import { transactions } from "@/db/schema/finances";
import { eq } from "drizzle-orm";

async function getTransaction(transactionId: number) {
  return await db.query.transactions.findFirst({
    where: eq(transactions.id, transactionId),
    with: {
      category: true,
    },
  });
}

export default async function TransactionsPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getTransaction(Number(params.id));
  return <div className="container mx-auto py-10">{JSON.stringify(data)}</div>;
}
