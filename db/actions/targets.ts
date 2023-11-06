'use server';

import { db } from '@/db';
import { financial_targets } from '@/db/schema/finances';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentProfile } from '@/db/queries/auth';

import { TargetForm } from '@/lib/validation/financial-target';

export async function createNewTarget(formData: TargetForm) {
  const currentProfile = await getCurrentProfile();
  console.log('hello');
  try {
    await db.insert(financial_targets).values({
      ...formData,
      id: uuidv4(),
      amount: Number(formData.amount),
      profileId: currentProfile.id,
    });
    revalidatePath('/');

    return { success: true, message: 'Success' };
  } catch (e) {
    console.log(e);
    revalidatePath('/');
    return { success: false, message: 'Something went wrong' };
  }
}
