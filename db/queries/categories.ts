"use server"

import { categories } from '../schema/finances';
import { db } from '@/db';

export async function getCategories() {
  return await db.select().from(categories);
}
