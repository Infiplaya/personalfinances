'use server';

import { categories, Category } from '../schema/finances';
import { db } from '@/db';
import { cache } from 'react';
import { calculateTotalForCategory } from './transactions';
import { getCurrencies, getCurrentCurrency } from './currencies';
import { getCurrentProfile } from './auth';

export async function selectCategories() {
  return await db.select().from(categories);
}

export const getCategories = cache(selectCategories);

export async function getCategory(slug: string) {
  const currentProfile = await getCurrentProfile();
  return await db.query.categories.findFirst({
    where: (categories, { eq }) => eq(categories.slug, slug),
    with: {
      transactions: {
        where: (transactions, { eq }) =>
          eq(transactions.profileId, currentProfile.id),
      },
    },
  });
}

export async function getCategoryPageData(category: Category) {
  const totalAmountPromise = calculateTotalForCategory(category.name);
  const totalMonthPromise = calculateTotalForCategory(category.name, true);
  const categoriesPromise = getCategories();
  const currenciesPromise = getCurrencies();
  const currentCurrencyPromise = getCurrentCurrency();

  const [totalAmount, totalMonth, categories, currencies, currentCurrency] =
    await Promise.all([
      totalAmountPromise,
      totalMonthPromise,
      categoriesPromise,
      currenciesPromise,
      currentCurrencyPromise,
    ]);

  return { totalAmount, totalMonth, categories, currencies, currentCurrency };
}
