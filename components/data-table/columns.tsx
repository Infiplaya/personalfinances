'use client';

import { Transaction } from '@/db/schema/finances';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import slugify from 'slugify';
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
import { deleteTransaction } from '@/db/actions/transactions';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '../ui/badge';
import { EditTransaction } from '@/app/(main)/transactions/[slug]/edit/edit-transaction';
import { Dialog, DialogTrigger } from '../ui/dialog';

export const columns: ColumnDef<Transaction>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: boolean) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    cell: ({ row }) => {
      return (
        <div className="ml-4 inline-flex items-center space-x-4">
          <Link href={`/${row.original.type}s`}>
            <Badge variant="secondary">{row.original.type}</Badge>
          </Link>
          <Link
            href={`/transactions/${row.original.slug}`}
            className="font-medium"
          >
            {row.getValue('name')}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: 'categoryName',
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
      return (
        <Link
          className="ml-4"
          href={`/categories/${slugify(row.getValue('categoryName'))}`}
        >
          <span className="inline-flex">{row.getValue('categoryName')}</span>
        </Link>
      );
    },
  },
  {
    accessorKey: 'currencyCode',
    header: ({ column }) => (
      <div>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Currency
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      return <div className="ml-4">{row.getValue('currencyCode')}</div>;
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
      const formatted = moneyFormat(amount, row.getValue('currencyCode'));

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
      return <div className="text-right">{dateFormat(date)}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <AlertDialog>
          <Dialog>
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

                <DialogTrigger asChild>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                </DialogTrigger>

                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>
                    <span>Delete</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>

                <Link href={`/transactions/${transaction.slug}`}>
                  <DropdownMenuItem>View details</DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this transaction from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <form
                  action={() => {
                    deleteTransaction(transaction.id);
                    toast.success('Succesfully deleted this transaction.');
                  }}
                >
                  <AlertDialogAction asChild>
                    <Button type="submit" className="w-full">
                      Delete
                    </Button>
                  </AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>

            <EditTransaction transaction={transaction} />
          </Dialog>
        </AlertDialog>
      );
    },
  },
];
