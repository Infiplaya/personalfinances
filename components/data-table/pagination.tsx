import { cn } from '@/lib/utils';
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface Props {
  page: number;
  lastPage: number;
  name: string | string[] | undefined;
  limit: number;
  notNextPage: boolean;
  notPreviousPage: boolean;
}

export default function Pagination({
  page,
  lastPage,
  name,
  limit,
  notNextPage,
  notPreviousPage,
}: Props) {
  return (
    <div className="flex items-center space-x-6">
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
            'rounded border bg-gray-100 p-1 text-sm text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900  dark:text-gray-100 dark:hover:bg-gray-800',
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
            'rounded border bg-gray-100 p-1 text-sm text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900  dark:text-gray-100 dark:hover:bg-gray-800',
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
            'rounded border bg-gray-100 p-1 text-sm text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900  dark:text-gray-100 dark:hover:bg-gray-800',
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
            'rounded border bg-gray-100 p-1 text-sm text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900  dark:text-gray-100 dark:hover:bg-gray-800',
            notNextPage && 'pointer-events-none opacity-50'
          )}
        >
          <span className="sr-only">Go to last page</span>
          <DoubleArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
