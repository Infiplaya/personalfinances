'use client';

import { Category, Currency } from '@/db/schema/finances';
import { useState } from 'react';
import { Drawer } from 'vaul';
import { TransactionForm } from './transaction-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';

export function TransactionDrawer({
  categories,
  currencies,
  currentCurrency,
}: {
  categories: Category[];
  currencies: Currency[];
  currentCurrency: string;
}) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'expense' | 'income'>(
    'expense'
  );
  return (
    <Drawer.Root open={open} onOpenChange={setOpen} shouldScaleBackground>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="items-center space-x-2" size="sm">
            <PlusCircle className="h-5 w-5 dark:text-gray-700" />{' '}
            <span>New Transaction</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Choose Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Drawer.Trigger className="w-full text-left" asChild>
            <DropdownMenuItem onClick={() => setSelectedType('expense')}>
              Expense
            </DropdownMenuItem>
          </Drawer.Trigger>

          <Drawer.Trigger className="w-full text-left" asChild>
            <DropdownMenuItem onClick={() => setSelectedType('income')}>
              Income
            </DropdownMenuItem>
          </Drawer.Trigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <Drawer.Portal className="">
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 top-20 flex max-h-[82vh] flex-col rounded-t-[10px] bg-gray-50 dark:bg-gray-950">
          <div className="mx-auto flex w-full max-w-md flex-col overflow-auto rounded-t-[10px] p-4">
            <TransactionForm
              currencies={currencies}
              categories={
                selectedType === 'expense'
                  ? categories.filter((c) => c.type === 'expense')
                  : categories.filter((c) => c.type === 'income')
              }
              type={selectedType}
              currentCurrency={currentCurrency}
              closeModal={() => setOpen(false)}
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
