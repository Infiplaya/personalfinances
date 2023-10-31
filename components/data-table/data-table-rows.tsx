'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function RowsControls({}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  function handleTableRows(value: string) {
    const params = new URLSearchParams(window.location.search);
    params.set('limit', value);
    params.delete('page');

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <Select
      onValueChange={(value) => handleTableRows(value)}
      defaultValue={'10'}
      disabled={isPending}
    >
      <div className="inline-flex items-center space-x-2">
        <Label className="hidden whitespace-nowrap md:block">
          Rows
        </Label>
        <SelectTrigger className="max-w-[6rem]">
          <SelectValue />
        </SelectTrigger>
      </div>
      <SelectContent>
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="20">20</SelectItem>
        <SelectItem value="30">30</SelectItem>
        <SelectItem value="50">50</SelectItem>
      </SelectContent>
    </Select>
  );
}
