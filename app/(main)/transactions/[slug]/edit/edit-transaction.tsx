'use client';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { DialogContent } from '@/components/ui/dialog';
import { DrawerContent } from '@/components/ui/drawer';
import { Transaction } from '@/db/schema/finances';
import { useIsMobile } from '@/hooks/useIsMobile';

interface Props {
  transaction: Transaction;
}

export function EditTransaction({ transaction }: Props) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DrawerContent>
        <TransactionForm transaction={transaction} edit={true} />
      </DrawerContent>
    );
  }

  return (
    <DialogContent>
      <TransactionForm transaction={transaction} edit={true} />
    </DialogContent>
  );
}
