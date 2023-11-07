'use server';

import { db } from '@/db';
import { financial_targets } from '@/db/schema/finances';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentProfile } from '@/db/queries/auth';

import { TargetForm } from '@/lib/validation/financial-target';
import { eq } from 'drizzle-orm';

export async function createNewTarget(formData: TargetForm) {
  const currentProfile = await getCurrentProfile();
  try {
    await db.insert(financial_targets).values({
      ...formData,
      id: uuidv4(),
      amount: Number(formData.amount),
      profileId: currentProfile.id,
    });
    revalidatePath('/');

    return { success: true, message: 'Created new target' };
  } catch (e) {
    console.log(e);
    revalidatePath('/');
    return { success: false, message: 'Something went wrong' };
  }
}

export async function editTarget(formData: TargetForm, targetId: string) {
  try {
    await db
      .update(financial_targets)
      .set({
        amount: Number(formData.amount),
        name: formData.name,
        currencyCode: formData.currencyCode,
      })
      .where(eq(financial_targets.id, targetId));
    revalidatePath('/');

    return { success: true, message: 'Edited target' };
  } catch (e) {
    console.log(e);
    revalidatePath('/');
    return { success: false, message: 'Something went wrong' };
  }
}
