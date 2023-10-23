'use server';
import { db } from '@/db';
import { cache } from 'react';

async function selectAllBudgetStatuses() {
  return await db.query.budgetStatuses.findMany({
    with: {
      budgetPlans: true,
    },
  });
}

export type BudgetStatus = Awaited<ReturnType<typeof selectAllBudgetStatuses>>[number];

export const getAllBudgetStatuses = cache(selectAllBudgetStatuses);
