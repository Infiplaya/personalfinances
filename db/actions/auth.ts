'use server';

import { db } from '@/db';
import { profiles, users } from '@/db/schema/auth';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { ProfileForm, RegisterForm } from '@/lib/validation/auth';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentProfile } from '@/db/queries/auth';
import { validateSession } from '@/db/queries/transactions';

import { z } from 'zod';
import { hash } from 'bcryptjs';

export async function registerUser(formData: RegisterForm) {
  try {
    const hashed_password = await hash(formData.password, 12);

    type NewUser = typeof users.$inferInsert;
    const insertUser = async (user: NewUser) => {
      return db.insert(users).values(user);
    };

    const newUser: NewUser = {
      id: uuidv4(),
      name: formData.name,
      password: hashed_password,
      currentProfile: 'default',
      email: formData.email.toLowerCase(),
    };
    await insertUser(newUser);

    type NewProfile = typeof profiles.$inferInsert;
    const insertProfile = async (profile: NewProfile) => {
      return db.insert(profiles).values(profile);
    };

    const newProfile: NewProfile = {
      id: uuidv4(),
      name: 'default',
      currencyCode: 'USD',
      userId: newUser.id,
      balance: 0,
    };
    await insertProfile(newProfile);

    return {
      success: true,
      message: 'Registration completed successfully',
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    };
  } catch (e: unknown) {
    console.log(e);
    return {
      success: false,
      error: 'Something went wrong. Try Again.',
    };
  }
}

export async function createNewProfile(formData: ProfileForm) {
  const session = await validateSession();

  try {
    await db.insert(profiles).values({
      id: uuidv4(),
      ...formData,
      userId: session.user.id,
    });
    revalidatePath('/');
    return { success: true, message: 'Created new profile' };
  } catch (e) {
    return { success: false, message: 'Something went wrong... Try Again' };
  }
}

export async function updateUserProfile(
  formData: ProfileForm,
  profileId: string | undefined
) {
  const currentProfile = await getCurrentProfile();

  const { user } = await validateSession();

  try {
    await db
      .update(profiles)
      .set({
        name: formData.name,
        currencyCode: formData.currencyCode,
      })
      .where(eq(profiles.id, profileId ? profileId : currentProfile.id));

    await db
      .update(users)
      .set({
        currentProfile: formData.name,
      })
      .where(eq(users.id, user.id));

    revalidatePath('/');

    return { success: true, message: 'Updated the profile' };
  } catch (e) {
    console.log(e);
    return { success: false, message: 'Something Went Wrong!' };
  }
}

const profileSchema = z.object({
  name: z.string().nonempty(),
});

export async function changeCurrentProfile(
  prevState: unknown,
  formData: FormData
) {
  const { user } = await validateSession();

  const data = profileSchema.parse({
    name: formData.get('name'),
  });

  try {
    await db
      .update(users)
      .set({
        currentProfile: data.name,
      })
      .where(eq(users.id, user.id));

    revalidatePath('/', 'layout');
    return { success: true, message: `Changed profile to ${data.name}` };
  } catch (e) {
    console.log(e);
    return { success: false, message: 'Something went wrong... Try again.' };
  }
}

export async function deleteProfile(profileId: string) {
  const { user } = await validateSession();
  const currentProfile = await getCurrentProfile();

  try {
    await db.delete(profiles).where(eq(profiles.id, profileId));
    currentProfile.id === profileId
      ? await db
          .update(users)
          .set({
            currentProfile: 'default',
          })
          .where(eq(users.id, user.id))
      : null;
    revalidatePath('/');
    return { success: true, message: 'Deleted profile successfully.' };
  } catch (e) {
    console.log(e);
    return { success: false, message: 'Something went wrong. Try Again' };
  }
}
