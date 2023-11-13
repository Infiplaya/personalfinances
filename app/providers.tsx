'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './providers/theme-provider';
import { Toaster } from 'sonner';
import { useIsMobile } from '@/hooks/useIsMobile';
import CurrenciesProvider from '@/context/CurrenciesContext';
import TransactionFormDataProvider from '@/context/TransactionFormDataContext';
import { Category, Currency } from '@/db/schema/finances';

export function Providers({
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
  const isMobile = useIsMobile();
  return (
    <SessionProvider>
      <CurrenciesProvider
        currencies={currencies}
        userCurrency={currentCurrency}
      >
        <TransactionFormDataProvider
          data={{ currencies, currentCurrency, categories }}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster
              richColors
              position={isMobile ? 'bottom-center' : 'top-center'}
            />
          </ThemeProvider>
        </TransactionFormDataProvider>
      </CurrenciesProvider>
    </SessionProvider>
  );
}
