import { TransactionForm } from "@/components/transaction-form";
import { db } from "@/db";

export default async function NewTransactionPage() {
  const categories = await db.query.categories.findMany();
  return (
    <div className="max-w-md mx-auto py-12">
      <TransactionForm categories={categories} />
    </div>
  );
}
