'use client';

import { Category, Transaction } from '@/db/schema/finances';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import Link from 'next/link';
import { dateFormat, moneyFormat } from '@/lib/utils';
import { deleteTransaction } from '@/app/actions';
import { toast } from 'sonner';
import { TransactionWithCategory } from './page';

export const columns: ColumnDef<TransactionWithCategory>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <div>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <div>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const category = row.getValue('category') as Category;

      return (
        <div className="font-medium">{category ? category.name : 'blank'}</div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = moneyFormat(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const date = row.getValue('timestamp') as Date;
      return <div className="text-right font-medium">{dateFormat(date)}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <AlertDialogTrigger>Delete</AlertDialogTrigger>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/transactions/${transaction.id}`}>
                  View details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>
                <form
                  className="w-full"
                  action={() => {
                    deleteTransaction(transaction.id);
                    toast.success('Succesfully deleted this transaction.');
                  }}
                >
                  <Button type="submit" className="w-full">
                    Delete
                  </Button>
                </form>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
