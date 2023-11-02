'use client';
import { Input } from '@/components/ui/input';
import debounce from 'lodash.debounce';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useTransition } from 'react';
import { Label } from '../ui/label';

export default function SearchTransactions() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSearch(term: string) {
    const params = new URLSearchParams(window.location.search);

    if (term) {
      params.set('name', term);
    } else {
      params.delete('name');
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }
  const handleDebouncedSearch = debounce(handleSearch, 300);

  return (
    <div className="relative">
      <Label>Search Transactions</Label>
      <Input
        placeholder="Type name..."
        onChange={(event) => handleDebouncedSearch(event.target.value)}
        className="relative mt-1 w-full md:max-w-[250px]"
        aria-disabled={isPending}
        defaultValue={searchParams.get('name') as string}
      />
      {isPending ? (
        <Loader2 className="absolute bottom-2 right-2 h-5 w-5 animate-spin text-neutral-800 dark:text-neutral-200" />
      ) : null}
    </div>
  );
}
