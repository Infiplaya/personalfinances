'use client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DrawerContent, DrawerRoot } from '@/components/ui/drawer';
import { TransactionWithCategory } from '@/db/queries/transactions';
import { useIsMobile } from '@/hooks/useIsMobile';
import { moneyFormat } from '@/lib/utils';
import { useState } from 'react';

export default function ViewTransaction({
  transaction,
}: {
  transaction: TransactionWithCategory;
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(true);

  if (isMobile) {
    return (
      <DrawerRoot open={open} onOpenChange={setOpen}>
        <DrawerContent>dsds</DrawerContent>
      </DrawerRoot>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {transaction.name} -{' '}
          {moneyFormat(transaction.amount, transaction.currencyCode)}{' '}
        </h1>
        <p>{transaction?.description}</p>
      </DialogContent>
    </Dialog>
  );
}
