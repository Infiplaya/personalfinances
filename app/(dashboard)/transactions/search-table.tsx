'use client';
import { Input } from '@/components/ui/input';
import debounce from 'lodash.debounce';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useTransition } from 'react';

export default function SearchTable() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  function handleSearch(term: string) {
    const params = new URLSearchParams(window.location.search);

    if (term) {
      params.set('name', term);
    } else {
      params.delete('name');
    }
    params.delete('page');
    params.delete('sort');

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }
  const handleDebouncedSearch = debounce(handleSearch, 300);

  return (
    <div className="my-6 w-full
    ">
      <div className="flex w-full items-center">
        <Input
          placeholder="Search by name..."
          onChange={(event) => handleDebouncedSearch(event.target.value)}
          className="max-w-sm"
        />
        <div className="-mt-2 ml-4 h-4 w-4 text-gray-800 dark:text-gray-200">
          {isPending && <Loader2 />}
        </div>
      </div>
    </div>
  );
}
