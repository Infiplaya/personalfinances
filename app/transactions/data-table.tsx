"use client";

import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import debounce from "lodash.debounce";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useTransition } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import SearchTable from "./search-table";
import { PaginationControls } from "./data-table-pagination";
import { RowsControls } from "./data-table-rows";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  count: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  count,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams?.get("page") ?? "1";
  const per_page = searchParams?.get("per_page") ?? "5";

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    manualSorting: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
  });

  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);
  const totalPages = Math.ceil(count / Number(per_page));

  function handleSort(id: string, sortType: "desc" | "asc" | boolean) {
    const params = new URLSearchParams(window.location.search);
    params.set("sort", `${id}.${sortType == "asc" ? "desc" : "asc"}`);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }
  return (
    <>
      <div className="flex w-auto justify-between py-3 items-center space-x-12">
        <SearchTable />
        <RowsControls />
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
                  data-state={row.getIsSelected() && "selected"}
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
      <div className="flex w-auto justify-end py-3 items-center space-x-12">
        <RowsControls />
        <PaginationControls
          hasNextPage={end < count}
          hasPrevPage={start > 0}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}
