import { Navbar } from '@/components/dashboard/navbar';
import { Sidebar } from '@/components/dashboard/sidebar';
import CurrenciesProvider from '@/context/CurrenciesContext';
import TransactionFormDataProvider from '@/context/TransactionFormDataContext';
import { getTransactionFormData } from '@/db/queries/transactions';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personal Finances App',
  description: 'Personal Finances App',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currencies, currentCurrency, categories } =
    await getTransactionFormData();
  return (
    <CurrenciesProvider currencies={currencies} userCurrency={currentCurrency}>
      <TransactionFormDataProvider
        data={{ currencies, currentCurrency, categories }}
      >
        <Navbar />
        <div>
          <Sidebar />
          <div className="mx-auto px-4 py-10 lg:ml-64 lg:px-12">{children}</div>
        </div>
      </TransactionFormDataProvider>
    </CurrenciesProvider>
  );
}
