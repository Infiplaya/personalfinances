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
    <div className="relative">
      <Input
        placeholder="Type name..."
        onChange={(event) => handleDebouncedSearch(event.target.value)}
        className="relative max-w-[200px]"
        aria-disabled={isPending}
      />
      {isPending ? (
        <Loader2 className="absolute right-2 top-2 ml-2 h-5 w-5 animate-spin text-gray-800 dark:text-gray-200" />
      ) : null}
    </div>
  );
}
