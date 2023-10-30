import { z } from 'zod';

export const planFormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Plan name must be atleast 4 char long.',
    })
    .max(60, {
      message: 'Profile name must be atmost 256 character long.',
    }),
  description: z.string().optional(),
  statusId: z.string(),
});

export type PlanForm = z.infer<typeof planFormSchema>;
