import { z } from 'zod';
import { getDayOfWeek } from '../utils';


export const overviewSchema = z.array(
    z.object({
        totalIncome: z.string(),
        totalExpenses: z.string(),
        day: z.number().transform((val) => getDayOfWeek(val)),
    })
);
