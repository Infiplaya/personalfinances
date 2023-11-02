'use client';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DrawerContent, DrawerRoot } from '@/components/ui/drawer';
import { Category, Currency, Transaction } from '@/db/schema/finances';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useRouter } from 'next/navigation';

interface Props {
  edit: boolean;
  transaction: Transaction;
  categories: Category[];
  currencies: Currency[];
}

export function EditTransaction({
  edit,
  transaction,
  categories,
  currencies,
}: Props) {
  const isMobile = useIsMobile();
  const router = useRouter();

  function handleOpenChange() {
    router.back();
  }

  if (isMobile) {
    return (
      <DrawerRoot open={edit} onOpenChange={handleOpenChange}>
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
    <Dialog open={edit} onOpenChange={handleOpenChange}>
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
