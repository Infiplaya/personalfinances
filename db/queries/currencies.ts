"use server"

import { currencies } from '../schema/finances';
import { db } from '@/db';

export async function getCurrencies() {
  return await db.select().from(currencies);
}
