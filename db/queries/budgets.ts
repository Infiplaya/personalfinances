'use server';
import { db } from '@/db';
import { cache } from 'react';
import { BudgetPlan, BudgetStatus, budgetStatuses } from '../schema/finances';
import { getCurrentProfile } from './auth';

export interface Column extends BudgetStatus {
  name: string;
  budgetPlans: BudgetPlan[];
}

export type Columns = { [key: string]: Column };

async function selectAllBudgetStatuses() {
  const currentProfile = await getCurrentProfile();
  const data = await db.query.budgetStatuses.findMany({
    with: {
      budgetPlans: {
        orderBy: (budgetPlans, { asc }) => [asc(budgetPlans.order)],
      },
    },
    where: (budgetStatuses, { eq }) =>
      eq(budgetStatuses.profileId, currentProfile.id),
  });

  return data.reduce((result: Columns, item, index) => {
    result[index] = item;
    return result;
  }, {});
}

export const getAllBudgetStatuses = cache(selectAllBudgetStatuses);
