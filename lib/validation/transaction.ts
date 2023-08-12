import { z } from "zod";

export const transactionFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name of transaction must be atleast 4 char long.",
    })
    .max(256, {
      message: "Name of transaction must be atmost 256 character long.",
    }),
  description: z.string(),
  quantity: z.string(),
  // userId: z.string(),
  categoryId: z.number(),
  type: z.enum(["expense", "income"]),
});

export type TransactionForm = z.infer<typeof transactionFormSchema>;
