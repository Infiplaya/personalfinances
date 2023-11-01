'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Drawer } from 'vaul';
import { DialogOverlay } from './dialog';
import { useRouter } from 'next/navigation';

const DrawerRoot = Drawer.Root;

const DrawerTrigger = Drawer.Trigger;

const DrawerPortal = ({ className, ...props }: { className: string }) => (
  <Drawer.Portal className={cn(className)} {...props} />
);
DrawerPortal.displayName = Drawer.Portal.displayName;

const InterceptedDrawerContent = React.forwardRef<
  React.ElementRef<typeof Drawer.Content>,
  React.ComponentPropsWithoutRef<typeof Drawer.Content>
>(({ className, children }, ref) => {
  const router = useRouter();

  const onDismiss = React.useCallback(() => {
    router.back();
  }, [router]);

  return (
    <Drawer.Portal>
      <DialogOverlay>
        <Drawer.Content
          onCloseAutoFocus={onDismiss}
          onPointerDownOutside={onDismiss}
          className={cn(
            'fixed bottom-0 left-0 right-0 top-36 flex max-h-[82vh] flex-col rounded-t-[10px] bg-white dark:bg-gray-950 md:hidden',
            className
          )}
          ref={ref}
        >
          <div className="mx-auto mt-2 w-1/4 rounded-lg bg-gray-200 py-1 dark:bg-gray-800"></div>
          <div className="mx-auto mt-3 flex w-full max-w-md flex-col overflow-auto rounded-t-[10px] p-3">
            {children}
          </div>
        </Drawer.Content>
      </DialogOverlay>
    </Drawer.Portal>
  );
});
InterceptedDrawerContent.displayName = Drawer.Content.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof Drawer.Content>,
  React.ComponentPropsWithoutRef<typeof Drawer.Content>
>(({ className, children }, ref) => (
  <Drawer.Portal>
    <DialogOverlay>
      <Drawer.Content
        className={cn(
          'fixed bottom-0 left-0 right-0 top-36 flex max-h-[82vh] flex-col rounded-t-[10px] bg-white dark:bg-gray-950 md:hidden',
          className
        )}
        ref={ref}
      >
        <div className="mx-auto mt-2 w-1/4 rounded-lg bg-gray-200 py-1 dark:bg-gray-800"></div>
        <div className="mx-auto mt-3 flex w-full max-w-md flex-col overflow-auto rounded-t-[10px] p-3">
          {children}
        </div>
      </Drawer.Content>
    </DialogOverlay>
  </Drawer.Portal>
));
DrawerContent.displayName = Drawer.Content.displayName;

export { DrawerRoot, DrawerTrigger, DrawerContent, InterceptedDrawerContent };
