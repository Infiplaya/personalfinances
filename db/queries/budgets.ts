'use server';
import { db } from '@/db';
import { cache } from 'react';
import { BudgetPlan, BudgetStatus } from '../schema/finances';
import { getCurrentProfile } from './auth';

export interface Column extends BudgetStatus {
  name: string;
  budgetPlans: BudgetPlan[];
}

export type Columns = { [key: string]: Column };

async function selectStatusesWithPlans() {
  const currentProfile = await getCurrentProfile();
  const data = await db.query.budgetStatuses.findMany({
    with: {
      budgetPlans: {
        orderBy: (budgetPlans, { asc }) => [asc(budgetPlans.order)],
      },
    },
    where: (budgetStatuses, { eq }) =>
      eq(budgetStatuses.profileId, currentProfile.id),
    orderBy: (budgetStatuses, { asc }) => [asc(budgetStatuses.createdAt)],
  });

  return data.reduce((result: Columns, item, index) => {
    result[index] = item;
    return result;
  }, {});
}

export const getStatusesWithPlans = cache(selectStatusesWithPlans);

async function selectAllStatuses() {
  const currentProfile = await getCurrentProfile();
  return await db.query.budgetStatuses.findMany({
    where: (budgetStatuses, { eq }) =>
      eq(budgetStatuses.profileId, currentProfile.id),
  });
}

export const getStatuses = cache(selectAllStatuses);
