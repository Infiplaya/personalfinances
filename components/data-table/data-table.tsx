'use client';

import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { DataTableToolbar } from './data-table-toolbar';
import { Category } from '@/db/schema/finances';
import { Button } from '@/components/ui/button';
import { deleteTransactions } from '@/db/actions/transactions';
import { cn } from '@/lib/utils';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  categories: Category[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  categories,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
    manualSorting: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
  });

  const transactionsToDelete = table
    .getRowModel()
    .rows.filter((row) => rowSelection[Number(row.id)])
    .map((row) => (row as { original: { id: number } }).original.id);

  const transactionsToDeleteIds = Object.values(transactionsToDelete);

  function handleSort(id: string, sortType: 'desc' | 'asc' | boolean) {
    if (id === 'select') return;
    const params = new URLSearchParams(window.location.search);
    params.set('sort', `${id}.${sortType == 'asc' ? 'desc' : 'asc'}`);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <DataTableToolbar table={table} categories={categories} />
        {Object.keys(rowSelection).length > 0 ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="destructive"
                className="my-3 w-full md:my-0 md:ml-8 md:w-auto"
              >
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  transactions from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={isPending}
                  onClick={() =>
                    startTransition(() => {
                      deleteTransactions(transactionsToDeleteIds);
                      setRowSelection({});
                    })
                  }
                  className="w-full md:w-auto"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>

      <div
        className={cn(
          '-mx-2 rounded-md border dark:border-neutral-800 md:mx-0',
          isPending && 'opacity-50'
        )}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      onClick={() =>
                        handleSort(
                          header.column.id,
                          header.column.getIsSorted()
                        )
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-10 flex flex-col items-center space-y-3 lg:flex-row lg:justify-between lg:space-y-0">
        <div className="flex-1 text-sm text-neutral-700 dark:text-neutral-200">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
    </>
  );
}
