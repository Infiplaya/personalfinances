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
      <div>
        <Sidebar />
        <div className="py-10 lg:ml-64 px-4 lg:px-12 mx-auto">{children}</div>
      </div>
    </>
  );
}
