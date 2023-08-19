'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { Category } from '@/db/schema/finances';
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

export function TransactionDialog({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'expense' | 'income'>(
    'expense'
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button className="hidden lg:block">New Transaction </Button>
          <PlusCircle className="lg:hidden" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Choose Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setSelectedType('expense')}>
            <DialogTrigger className="w-full text-left">Expense</DialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedType('income')}>
            <DialogTrigger className="w-full text-left">Income</DialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <TransactionForm
          categories={
            selectedType === 'expense'
              ? categories.filter((c) => c.type === 'expense')
              : categories.filter((c) => c.type === 'income')
          }
          type={selectedType}
          closeModal={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
