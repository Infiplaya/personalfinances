'use client';
import {
  Dialog,
  DialogContent,
  InterceptedDialogContent,
} from '@/components/ui/dialog';
import {
  DrawerContent,
  DrawerRoot,
  InterceptedDrawerContent,
} from '@/components/ui/drawer';
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
        <InterceptedDrawerContent>
          <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight">
            {transaction.name} -{' '}
            {moneyFormat(transaction.amount, transaction.currencyCode)}{' '}
          </h1>
          <p>{transaction?.description}</p>
        </InterceptedDrawerContent>
      </DrawerRoot>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <InterceptedDialogContent>
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight">
          {transaction.name} -{' '}
          {moneyFormat(transaction.amount, transaction.currencyCode)}{' '}
        </h1>
        <p>{transaction?.description}</p>
      </InterceptedDialogContent>
    </Dialog>
  );
}
