import { cn } from '@/lib/utils';
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { RowsControls } from './data-table-rows';

interface Props {
  page: number;
  lastPage: number;
  name?: string | string[];
  limit: number;
  notNextPage: boolean;
  notPreviousPage: boolean;
}

export function Pagination({
  page,
  lastPage,
  name,
  limit,
  notNextPage,
  notPreviousPage,
}: Props) {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="text-sm">
        Page {page} of {lastPage}
      </p>
      <div className="flex space-x-2">
        <Link
          href={{
            pathname: '/transactions',
            query: {
              ...(name ? { name } : {}),
              ...(limit ? { limit } : {}),
              page: 1,
            },
          }}
          className={cn(
            'rounded border bg-neutral-100 p-1 text-sm text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900  dark:text-neutral-100 dark:hover:bg-neutral-800',
            notPreviousPage && 'pointer-events-none opacity-50'
          )}
        >
          <span className="sr-only">Go to first page</span>
          <DoubleArrowLeftIcon className="h-4 w-4" />
        </Link>
        <Link
          href={{
            pathname: '/transactions',
            query: {
              ...(name ? { name } : {}),
              ...(limit ? { limit } : {}),
              page: page > 1 ? page - 1 : 1,
            },
          }}
          className={cn(
            'rounded border bg-neutral-100 p-1 text-sm text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900  dark:text-neutral-100 dark:hover:bg-neutral-800',
            notPreviousPage && 'pointer-events-none opacity-50'
          )}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Link>
        <Link
          href={{
            pathname: '/transactions',
            query: {
              ...(name ? { name } : {}),
              ...(limit ? { limit } : {}),
              page: page + 1,
            },
          }}
          className={cn(
            'rounded border bg-neutral-100 p-1 text-sm text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900  dark:text-neutral-100 dark:hover:bg-neutral-800',
            notNextPage && 'pointer-events-none opacity-50'
          )}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
        <Link
          href={{
            pathname: '/transactions',
            query: {
              ...(name ? { name } : {}),
              ...(limit ? { limit } : {}),
              page: lastPage,
            },
          }}
          className={cn(
            'rounded border bg-neutral-100 p-1 text-sm text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900  dark:text-neutral-100 dark:hover:bg-neutral-800',
            notNextPage && 'pointer-events-none opacity-50'
          )}
        >
          <span className="sr-only">Go to last page</span>
          <DoubleArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
      <RowsControls />
    </div>
  );
}
