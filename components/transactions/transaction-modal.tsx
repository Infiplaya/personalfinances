'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { Category, Currency } from '@/db/schema/finances';
import { useState } from 'react';
import { Button } from '../ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlusCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { DrawerContent, DrawerRoot, DrawerTrigger } from '../ui/drawer';

export function TransactionModal({
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

  const filteredCategories =
    selectedType === 'expense'
      ? categories.filter((c) => c.type === 'expense')
      : categories.filter((c) => c.type === 'income');

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DrawerRoot open={open} onOpenChange={setOpen} shouldScaleBackground>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="space-x-2 w-full"
            >
              <PlusCircle className="h-5 w-5 dark:text-neutral-700" />{' '}
              <span>New Transaction</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Choose Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DrawerTrigger className="w-full text-left" asChild>
              <DropdownMenuItem onClick={() => setSelectedType('expense')}>
                Expense
              </DropdownMenuItem>
            </DrawerTrigger>

            <DrawerTrigger className="w-full text-left" asChild>
              <DropdownMenuItem onClick={() => setSelectedType('income')}>
                Income
              </DropdownMenuItem>
            </DrawerTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <DrawerContent>
          <TransactionForm
            currencies={currencies}
            categories={filteredCategories}
            type={selectedType}
            currentCurrency={currentCurrency}
            closeModal={() => setOpen(false)}
          />
        </DrawerContent>
      </DrawerRoot>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="inline-flex items-center space-x-2" size="sm">
            <PlusCircle className="h-5 w-5 dark:text-neutral-700" />{' '}
            <span>New Transaction</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>Choose Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger className="w-full text-left" asChild>
            <DropdownMenuItem onClick={() => setSelectedType('expense')}>
              Expense
            </DropdownMenuItem>
          </DialogTrigger>

          <DialogTrigger className="w-full text-left" asChild>
            <DropdownMenuItem onClick={() => setSelectedType('income')}>
              Income
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <TransactionForm
          categories={
            selectedType === 'expense'
              ? categories.filter((c) => c.type === 'expense')
              : categories.filter((c) => c.type === 'income')
          }
          currencies={currencies}
          type={selectedType}
          closeModal={() => setOpen(false)}
          currentCurrency={currentCurrency}
        />
      </DialogContent>
    </Dialog>
  );
}
