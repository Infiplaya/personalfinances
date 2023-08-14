import { SignIn } from "@/components/sign-in";
import { TransactionForm } from "@/components/transaction-form";
import { db } from "@/db";
import { categories, transactions } from "@/db/schema/finances";
import { authOptions } from "@/lib/auth/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const categoriesQuery = await db.query.categories.findMany({
    with: {
      transactions: true,
    },
  });

  const transactionsQuery = await db.query.transactions.findMany({
    // with: {
    //   category: true,
    // },
  });

  const createCategory = async () => {
    "use server";

    await db
      .insert(categories)
      .values({ name: "asdsdada", description: "Groceries are cool" });

    revalidatePath("/");
  };

  return (
    <main className="max-w-lg mx-auto py-24">
      <SignIn />
      <TransactionForm categories={categoriesQuery} />
    </main>
  );
}
