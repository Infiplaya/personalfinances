'use client';

import { Dialog, InterceptedDialogContent } from '@/components/ui/dialog';
import { DrawerRoot, InterceptedDrawerContent } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/useIsMobile';

import { ReactNode, useState } from 'react';

export default function ViewTransaction({
  children
}: {
  children: ReactNode;
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(true);

  if (isMobile) {
    return (
      <DrawerRoot open={open} onOpenChange={setOpen}>
        <InterceptedDrawerContent>
          {children}
        </InterceptedDrawerContent>
      </DrawerRoot>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <InterceptedDialogContent>
        {children}
      </InterceptedDialogContent>
    </Dialog>
  );
}
