import type { Metadata } from 'next';
import Navbar from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';

export const metadata: Metadata = {
  title: 'Personal Finances App',
  description: 'Generated by Personal Finances App',
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
      <div className="container mx-auto space-y-10 py-10 lg:pl-24">
        {children}
      </div>
    </>
  );
}
