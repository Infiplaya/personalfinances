'use server';

import { db } from '@/db';
import {
  BudgetPlan,
  budgetPlans,
  budgetStatuses,
} from '@/db/schema/finances';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentProfile } from '@/db/queries/auth';

import { z } from 'zod';
import { PlanForm } from '@/lib/validation/budget';

export async function updateBudgetPlanStatus(planId: string, statusId: string) {
  try {
    await db
      .update(budgetPlans)
      .set({
        statusId: statusId,
      })
      .where(eq(budgetPlans.id, planId));

    revalidatePath('/budget');
    return { success: true, message: 'Successfully created new profile!' };
  } catch (e) {
    return { success: false, message: 'Something went wrong... Try Again' };
  }
}

export async function updateBudgetOrder(newOrder: BudgetPlan[]) {
  try {
    for (let i = 0; i < newOrder.length; i++) {
      const planId = newOrder[i].id;
      await db
        .update(budgetPlans)
        .set({
          order: i,
        })
        .where(eq(budgetPlans.id, planId));
    }

    revalidatePath('/budget');
    return { success: true, message: 'Successfully created new profile!' };
  } catch (e) {
    return { success: false, message: 'Something went wrong... Try Again' };
  }
}

export async function changeBudgetColumnName(formData: FormData) {
  const columnFormSchema = z.object({
    name: z.string(),
    columnId: z.string(),
  });

  const data = columnFormSchema.parse({
    name: formData.get('name'),
    columnId: formData.get('columnId'),
  });

  try {
    await db
      .update(budgetStatuses)
      .set({
        name: data.name,
      })
      .where(eq(budgetStatuses.id, data.columnId));

    revalidatePath('/');
    return { success: true, message: 'Successfully updated the name!' };
  } catch (e) {
    return { success: false, message: 'Something went wrong... Try Again' };
  }
}

export async function createBudgetColumn(
  prevState: unknown,
  formData: FormData
) {
  const currentProfile = await getCurrentProfile();

  const columnFormSchema = z.object({
    name: z.string().nonempty('Name cant be blank').min(1),
    columnId: z.string(),
  });

  const result = columnFormSchema.safeParse({
    name: formData.get('name'),
    columnId: uuidv4(),
  });

  if (!result.success) {
    return { success: false, message: result.error.format().name?._errors[0] };
  }

  try {
    await db.insert(budgetStatuses).values({
      name: result.data.name,
      id: result.data.columnId,
      profileId: currentProfile.id,
    });

    revalidatePath('/budget', 'layout');
    return { success: true, message: `Created status ${result.data.name}!` };
  } catch (e) {
    return { success: false, message: 'This column name is taken.' };
  }
}

export async function createStatusFromClient(name: string, columnId: string) {
  const currentProfile = await getCurrentProfile();

  const columnFormSchema = z.object({
    name: z.string().nonempty('Name cant be blank').min(1),
    columnId: z.string(),
  });

  const result = columnFormSchema.safeParse({
    name,
    columnId,
  });

  if (!result.success) {
    return { success: false, message: result.error.format().name?._errors[0] };
  }

  try {
    await db.insert(budgetStatuses).values({
      name: result.data.name,
      id: result.data.columnId,
      profileId: currentProfile.id,
    });

    return { success: true, message: 'Created new status' };
  } catch (e) {
    return { success: false, message: 'This column name is taken.' };
  }
}

export async function deleteBudgetColumn(formData: FormData) {
  const columnFormSchema = z.object({
    columnId: z.string(),
  });

  const data = columnFormSchema.parse({
    columnId: formData.get('columnId'),
  });

  try {
    await db.delete(budgetStatuses).where(eq(budgetStatuses.id, data.columnId));

    revalidatePath('/budget');
    return { success: true, message: 'Column deleted' };
  } catch (e) {
    return { success: false, message: 'Something went wrong... Try Again' };
  }
}

export async function deleteBudgetItems(formData: FormData) {
  const columnFormSchema = z.object({
    columnId: z.string(),
  });

  const data = columnFormSchema.parse({
    columnId: formData.get('columnId'),
  });

  try {
    await db.delete(budgetPlans).where(eq(budgetPlans.statusId, data.columnId));

    revalidatePath('/');
    return { success: true, message: 'Cleared all items' };
  } catch (e) {
    return { success: false, message: 'Something went wrong... Try Again' };
  }
}

export async function createBudgetPlan(prevState: unknown, formData: FormData) {
  const planFormSchema = z.object({
    id: z.string(),
    name: z.string().nonempty('Name cant be blank').min(1),
    columnId: z.string(),
  });

  const result = planFormSchema.safeParse({
    id: uuidv4(),
    name: formData.get('name'),
    columnId: formData.get('columnId'),
  });

  if (!result.success) {
    return { success: false, message: result.error.format().name?._errors[0] };
  }

  try {
    await db.insert(budgetPlans).values({
      name: result.data.name,
      id: result.data.id,
      statusId: result.data.columnId,
      order: 0,
    });

    revalidatePath('/');
    return { success: true, message: 'Created new plan!' };
  } catch (e) {
    return { success: false, message: 'This column name is taken.' };
  }
}

export async function deleteBudgetPlan(planId: string) {
  try {
    await db.delete(budgetPlans).where(eq(budgetPlans.id, planId));
    revalidatePath('/');
    return { success: true, message: 'Deleted this plan' };
  } catch (e) {
    return { success: false, message: 'Something went wrong... Try Again' };
  }
}

export async function changeBudgetPlanName(
  prevState: unknown,
  formData: FormData
) {
  const planFormSchema = z.object({
    name: z.string(),
    planId: z.string(),
  });

  const result = planFormSchema.safeParse({
    name: formData.get('name'),
    planId: formData.get('planId'),
  });

  if (!result.success) {
    return { success: false, message: result.error.format().name?._errors[0] };
  }

  console.log(formData);

  try {
    await db
      .update(budgetPlans)
      .set({
        name: result.data.name,
      })
      .where(eq(budgetPlans.id, result.data.planId));

    revalidatePath('/');
    return { success: true, message: 'Updated name of the plan' };
  } catch (e) {
    return { success: false, message: 'Something went wrong' };
  }
}

export async function updateBudgetPlan(formData: PlanForm, planId: string) {
  try {
    await db
      .update(budgetPlans)
      .set({
        name: formData.name,
        description: formData.description,
        statusId: formData.statusId,
      })
      .where(eq(budgetPlans.id, planId));

    revalidatePath('/budget');

    return { success: true, message: 'Updated the plan' };
  } catch (e) {
    console.log(e);
    return { success: false, message: 'Something went wrong' };
  }
}
