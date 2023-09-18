"use server"

import { currencies } from '../schema/finances';
import { db } from '@/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { users } from '../schema/auth';
import { eq } from 'drizzle-orm';

export async function getCurrencies() {
  return await db.select().from(currencies);
}

export async function getUserPrefferedCurrency() {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) throw new Error();

  const result = await db.select({
    currencyCode: users.currencyCode
  }).from(users).where(eq(users.id, session.user.id));
  return result[0].currencyCode;
}
