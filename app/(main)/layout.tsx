import { Navbar } from '@/components/dashboard/navbar';
import { Sidebar } from '@/components/dashboard/sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personal Finances App',
  description: 'lsds Personal Finances App',
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div>
        <Sidebar />
        <div className="mx-auto px-4 py-10 lg:ml-64 lg:px-12">{children}</div>
        {modal}
      </div>
    </>
  );
}
