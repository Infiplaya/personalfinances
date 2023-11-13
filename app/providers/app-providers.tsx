'use client';

import { ReactNode } from 'react';
import CurrenciesProvider from '@/lib/context/CurrenciesContext';
import TransactionFormDataProvider from '@/lib/context/TransactionFormDataContext';
import { Category, Currency } from '@/db/schema/finances';

export function AppProviders({
  children,
  currencies,
  currentCurrency,
  categories,
}: {
  children: ReactNode;
  currencies: Currency[];
  currentCurrency: string;
  categories: Category[];
}) {
  return (
    <CurrenciesProvider currencies={currencies} userCurrency={currentCurrency}>
      <TransactionFormDataProvider
        data={{ currencies, currentCurrency, categories }}
      >
        {children}
      </TransactionFormDataProvider>
    </CurrenciesProvider>
  );
}
