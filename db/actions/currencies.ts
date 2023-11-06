'use server';

import { db } from '@/db';
import { profiles } from '@/db/schema/auth';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getCurrentProfile } from '@/db/queries/auth';

import { z } from 'zod';

const currencySchema = z.object({
  code: z.string().min(1),
});

export async function changeCurrency(prevState: unknown, formData: FormData) {
  const currentProfile = await getCurrentProfile();
  const data = currencySchema.parse({
    code: formData.get('code'),
  });

  try {
    await db
      .update(profiles)
      .set({
        currencyCode: data.code,
      })
      .where(eq(profiles.id, currentProfile.id));

    revalidatePath('/');
    return {
      success: true,
      message: `Changed currency to ${data.code}`,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: 'Something went wrong. Try Again',
    };
  }
}
