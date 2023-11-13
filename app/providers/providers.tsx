'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './theme-provider';
import { Toaster } from 'sonner';
import { useIsMobile } from '@/hooks/useIsMobile';

export function Providers({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster
          richColors
          position={isMobile ? 'bottom-center' : 'top-center'}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
