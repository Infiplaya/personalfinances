import { Navbar } from '@/components/dashboard/navbar';
import { Sidebar } from '@/components/dashboard/sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personal Finances App',
  description: 'lsds Personal Finances App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="max-w-7xl px-4 mx-auto space-y-10 py-10">
        {children}
      </div>
    </>
  );
}
