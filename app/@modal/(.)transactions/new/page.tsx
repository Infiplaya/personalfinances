import NewTransactionDialog from "@/components/new-transaction-dialog";
import { db } from "@/db";

export default async function TransactionModal() {
  const categories = await db.query.categories.findMany();
  return <NewTransactionDialog categories={categories} />;
}
