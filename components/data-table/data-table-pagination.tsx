'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface PaginationControlsProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
}

export function DataTablePagination({
  hasNextPage,
  hasPrevPage,
  totalPages,
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  const page = searchParams.get('page') ?? '1';

  function handleNextPage() {
    const params = new URLSearchParams(window.location.search);
    params.set('page', (Number(page) + 1).toString());

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  function handlePreviousPage() {
    const params = new URLSearchParams(window.location.search);
    params.set('page', (Number(page) - 1).toString());

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex items-center space-x-2  py-4 lg:justify-end">
      <Button
        disabled={!hasPrevPage || isPending}
        variant="outline"
        size="sm"
        onClick={() => handlePreviousPage()}
      >
        Previous
      </Button>

      <div>
        {page} of {totalPages}
      </div>

      <Button
        disabled={!hasNextPage || isPending}
        variant="outline"
        size="sm"
        onClick={() => handleNextPage()}
      >
        Next
      </Button>
    </div>
  );
}
