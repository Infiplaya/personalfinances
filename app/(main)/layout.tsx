import { Navbar } from '@/components/dashboard/navbar';
import { Sidebar } from '@/components/dashboard/sidebar';
import CurrenciesProvider from '@/context/CurrenciesContext';
import { getCurrencies, getCurrentCurrency } from '@/db/queries/currencies';
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
  const currencies = await getCurrencies();
  const currentCurrency = await getCurrentCurrency();
  return (
    <CurrenciesProvider currencies={currencies} userCurrency={currentCurrency}>
      <Navbar />
      <div>
        <Sidebar />
        <div className="mx-auto px-4 py-10 lg:ml-64 lg:px-12">{children}</div>
      </div>
    </CurrenciesProvider>
  );
}
