'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Drawer } from 'vaul';
import { DialogOverlay } from '@radix-ui/react-dialog';

const DrawerRoot = Drawer.Root;

const DrawerTrigger = Drawer.Trigger;

const DrawerPortal = ({ ...props }) => <Drawer.Portal {...props} />;
DrawerPortal.displayName = Drawer.Portal.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof Drawer.Content>,
  React.ComponentPropsWithoutRef<typeof Drawer.Content>
>(({ className, children }, ref) => (
  <Drawer.Portal>
    <DialogOverlay className="fixed inset-0 bg-white/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-neutral-950/80">
      <Drawer.Content
        className={cn(
          'fixed bottom-0 left-0 right-0 top-24 flex max-h-[82vh] flex-col rounded-t-[10px] border bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 md:hidden',
          className
        )}
        ref={ref}
      >
        <div className="mx-auto mt-2 w-1/4 rounded-lg bg-neutral-200 py-1 dark:bg-neutral-800"></div>
        <div className="mx-auto mt-3 flex w-full max-w-md flex-col overflow-auto rounded-t-[10px] p-3">
          {children}
        </div>
      </Drawer.Content>
    </DialogOverlay>
  </Drawer.Portal>
));
DrawerContent.displayName = Drawer.Content.displayName;

export { DrawerRoot, DrawerTrigger, DrawerContent };
