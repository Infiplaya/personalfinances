'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ReactNode, useState } from 'react';
import { DrawerContent, DrawerRoot, DrawerTrigger } from '../ui/drawer';
import { Button } from '../ui/button';

export function NewTargetModal({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DrawerRoot open={open} onOpenChange={setOpen} shouldScaleBackground>
        <DrawerTrigger asChild>
          <Button>Set New</Button>
        </DrawerTrigger>
        <DrawerContent>target form here</DrawerContent>
      </DrawerRoot>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Set New</Button>
      </DialogTrigger>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
