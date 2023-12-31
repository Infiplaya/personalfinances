'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { DataTableFacetedFilter } from './data-table-filter';
import { Category } from '@/db/schema/finances';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { RowsControls } from './data-table-rows';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  categories: Category[];
}

export function DataTableToolbar<TData>({
  table,
  categories,
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const isFiltered = searchParams.has('type') || searchParams.has('category');

  return (
    <div className="my-6 flex w-full items-center justify-between">
      <div className="inline-flex space-x-6">
        <div className="mr-auto inline-flex space-x-4">
          {table.getColumn('categoryName') && (
            <DataTableFacetedFilter title="category" options={categories} />
          )}
          {table.getColumn('name') && (
            <DataTableFacetedFilter
              title="type"
              options={[
                { id: 0, name: 'expense' },
                { id: 1, name: 'income' },
              ]}
            />
          )}

          {isFiltered && (
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => {
                const params = new URLSearchParams(window.location.search);
                params.delete('category');
                params.delete('type');

                startTransition(() => {
                  router.replace(`${pathname}?${params.toString()}`);
                });
              }}
              className="h-8 px-2 lg:px-3"
            >
              <span className="hidden md:block">Reset</span>
              <Cross2Icon className="h-4 w-4 md:ml-2" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex space-x-12">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              Columns
              <ChevronDown className="ml-2 h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="text-xs capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="hidden md:block">
          <RowsControls />
        </div>
      </div>
    </div>
  );
}
