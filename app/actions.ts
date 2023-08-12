// "use server";

// import { db } from "@/db";
// import { transactions } from "@/db/schema/finances";
// import { authOptions } from "@/lib/auth/auth";
// import {
//   TransactionForm,
//   transactionFormSchema,
// } from "@/lib/validation/transaction";
// import { getServerSession } from "next-auth";
// import { revalidatePath } from "next/cache";

// async function createNewTransaction(formData: TransactionForm) {
//   const session = await getServerSession(authOptions);
//   try {
//     await db.insert(transactions).values({
//       ...formData,
//       userId: session?.user.id,
//     });

//     revalidatePath("/");
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function submitTransactionForm(formData: TransactionForm) {
//   transactionFormSchema.parse(formData);
//   console.log(formData)
//   revalidatePath("/");
// }
