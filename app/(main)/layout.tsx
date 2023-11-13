import { Navbar } from '@/components/dashboard/navbar';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TransactionModal } from '@/components/transactions/transaction-modal';
import { getTransactionFormData } from '@/db/queries/transactions';
import type { Metadata } from 'next';
import { AppProviders } from '../providers/app-providers';

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
    <AppProviders
      currencies={currencies}
      currentCurrency={currentCurrency}
      categories={categories}
    >
      <Navbar />
      <div>
        <div className="fixed bottom-10 right-5 z-50 md:hidden">
          <TransactionModal />
        </div>
        <Sidebar />
        <div className="mx-auto px-4 py-10 lg:ml-64 lg:px-12">{children}</div>
      </div>
    </AppProviders>
  );
}
