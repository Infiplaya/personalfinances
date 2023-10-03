'use server';
import { db } from '@/db';
import { cache } from 'react';
import { validateSession } from './transactions';
import { profiles, users } from '../schema/auth';
import { and, eq } from 'drizzle-orm';

export async function selectCurrentProfile() {
  const { user } = await validateSession();

  const userProfile = await db
    .select({
      currentProfile: users.currentProfile,
    })
    .from(users)
    .where(eq(users.id, user.id));
  const currentProfileName = userProfile[0].currentProfile;

  const currentProfile = await db
    .select()
    .from(profiles)
    .where(
      and(
        eq(profiles.userId, user.id),
        eq(profiles.name, currentProfileName ? currentProfileName : '')
      )
    );

  return currentProfile[0];
}

export const getCurrentProfile = cache(selectCurrentProfile);

export async function selectUserProfiles() {
  const { user } = await validateSession();

  return await db.select().from(profiles).where(eq(profiles.userId, user.id));
}

export const getUserProfiles = cache(selectUserProfiles);
