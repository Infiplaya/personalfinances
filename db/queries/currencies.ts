'use server';

import { currencies } from '../schema/finances';
import { db } from '@/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { cache } from 'react';
import { getCurrentProfile } from './auth';
import { InferModel } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { profiles } from '../schema/auth';

export async function selectCurrencies() {
  return await db.select().from(currencies);
}

export const getCurrencies = cache(selectCurrencies);

async function selectCurrentCurrency() {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) throw new Error();

  // get the userId and find the current profile
  const currentProfile = await getCurrentProfile();

  if (!currentProfile) {
    type NewProfile = InferModel<typeof profiles, 'insert'>;
    const insertProfile = async (profile: NewProfile) => {
      return db.insert(profiles).values(profile);
    };

    const newProfile: NewProfile = {
      id: uuidv4(),
      name: 'default',
      currencyCode: 'USD',
      userId: session.user.id,
    };
    await insertProfile(newProfile);

    return newProfile.currencyCode
  }

  return currentProfile.currencyCode;
}

export const getCurrentCurrency = cache(selectCurrentCurrency);
