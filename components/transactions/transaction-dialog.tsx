'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { Category } from '@/db/schema/finances';
import { useState } from 'react';
import { Button } from '../ui/button';

export function TransactionDialog({ categories }: { categories: Category[] }) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button>New Transaction</Button>
            </DialogTrigger>
            <DialogContent>
                <TransactionForm
                    categories={categories}
                    closeModal={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
