'use server';

import { categories } from '../schema/finances';
import { db } from '@/db';
import { cache } from 'react';

export async function selectCategories() {
  return await db.select().from(categories);
}

export const getCategories = cache(selectCategories);
