import { authOptions } from '@/lib/auth/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect('/');
  }
  return (
    <div className="mx-auto flex h-full max-w-5xl flex-col items-center justify-center md:flex-row md:justify-between">
      {children}
    </div>
  );
}
