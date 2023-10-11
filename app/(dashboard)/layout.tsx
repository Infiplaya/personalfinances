import { Navbar } from '@/components/dashboard/navbar';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';
import { Suspense } from 'react';

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
      <Suspense fallback={<Skeleton className="h-12 w-full" />}>
        <Navbar />
      </Suspense>
      <Sidebar />
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10">{children}</div>
    </>
  );
}
