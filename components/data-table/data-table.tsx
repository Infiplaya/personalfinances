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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState, useTransition } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { DataTablePagination } from './data-table-pagination';
import { RowsControls } from './data-table-rows';
import { DataTableToolbar } from './data-table-toolbar';
import { Category, Transaction } from '@/db/schema/finances';
import { Button } from '@/components/ui/button';
import { deleteTransactions } from '@/app/actions';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  count: number;
  categories: Category[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  count,
  categories,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams?.get('page') ?? '1';
  const per_page = searchParams?.get('per_page') ?? '10';

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

  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);
  const totalPages = Math.ceil(count / Number(per_page));

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
      <div className="flex items-center space-x-3 lg:flex-row lg:items-center lg:justify-between">
        <DataTableToolbar table={table} categories={categories} />
        {Object.keys(rowSelection).length > 0 ? (
          <Button
            size="sm"
            disabled={isPending}
            onClick={() =>
              startTransition(() => {
                deleteTransactions(transactionsToDeleteIds);
                setRowSelection({});
              })
            }
            variant="destructive"
          >
            Delete
          </Button>
        ) : null}
      </div>

      <div className="rounded-md border dark:border-gray-800">
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
        <div className="space-y-3">
          <RowsControls />
          <div className="flex-1 text-sm text-gray-700 dark:text-gray-200">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        </div>

        <DataTablePagination
          hasNextPage={end < count}
          hasPrevPage={start > 0}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}
