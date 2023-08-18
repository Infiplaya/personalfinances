import { z } from "zod";

const decimalValidator = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, {
    message: "Amount must be in numeric format, max 2 numbers after a comma",
  });

export const transactionFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name of transaction must be atleast 4 char long.",
    })
    .max(256, {
      message: "Name of transaction must be atmost 256 character long.",
    })
    .optional(),
  description: z.string().optional(),
  amount: decimalValidator,
  categoryName: z.string(),
  type: z.enum(["expense", "income"]),
});

export type TransactionForm = z.infer<typeof transactionFormSchema>;
