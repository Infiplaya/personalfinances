'use client';

import { TransactionForm } from '@/components/transactions/transaction-form';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DrawerContent, DrawerRoot } from '@/components/ui/drawer';
import { Category, Currency, Transaction } from '@/db/schema/finances';
import { useIsMobile } from '@/hooks/useIsMobile';

interface Props {
  edit: boolean;
  transaction: Transaction;
  categories: Category[];
  currencies: Currency[];
}

export default function EditTransaction({
  edit,
  transaction,
  categories,
  currencies,
}: Props) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DrawerRoot defaultOpen={edit}>
        <DrawerContent>
          <TransactionForm
            categories={categories.filter((c) => c.type === transaction.type)}
            currencies={currencies}
            transaction={transaction}
            edit={true}
          />
        </DrawerContent>
      </DrawerRoot>
    );
  }

  return (
    <Dialog defaultOpen={edit}>
      <DialogContent>
        <TransactionForm
          categories={categories.filter((c) => c.type === transaction.type)}
          currencies={currencies}
          transaction={transaction}
          edit={true}
        />
      </DialogContent>
    </Dialog>
  );
}
