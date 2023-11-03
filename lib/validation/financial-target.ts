import { z } from 'zod';

const decimalValidator = z.string().regex(/^\d+(\.\d{1,2})?$/, {
  message: 'Amount must be in numeric format, max 2 numbers after a comma',
});

export const targetFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be atleast 3 character long',
    })
    .max(90, {
      message: 'Name must be max 90 character long',
    }),
  amount: decimalValidator,
  currencyCode: z.string().length(3),
  type: z.enum(['goal', 'limit']),
  timePeriod: z.enum(['day', 'month', 'year']),
});

export type TargetForm = z.infer<typeof targetFormSchema>;
