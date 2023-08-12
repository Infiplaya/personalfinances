import { SignIn } from "@/components/sign-in";
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
    with: {
      category: true
    },
  });


  const createCategory = async () => {
    "use server";

    await db
      .insert(categories)
      .values({ name: "asdsdada", description: "Groceries are cool" });

    revalidatePath("/");
  };

  const createTransaction = async () => {
    "use server";
    try {
      await db.insert(transactions).values({
        name: "new transactiones",
        description: "Groceries are cool",
        quantity: 500.22,
        userId: session?.user.id,
        categoryId: 12,
        type: "income",
      });

      revalidatePath("/");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <main>
      hello, world
      {JSON.stringify(session?.user.id)}
      <SignIn />
      <form action={createCategory}>
        <button>create category</button>
      </form>
      <form action={createTransaction}>
        <button>create transaction</button>
      </form>
      {JSON.stringify(categoriesQuery)}
      <div className="bg-red-500">{JSON.stringify(transactionsQuery)}</div>
    </main>
  );
}
