'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TargetType } from '@/db/queries/targets';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

const timePeriods = ['day', 'month', 'year'];

export function SelectTargetPeriod({ targetType }: { targetType: TargetType }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <Select
      disabled={isPending}
      defaultValue={searchParams.get(`${targetType}Period`) ?? 'day'}
      onValueChange={(v) => {
        const params = new URLSearchParams(window.location.search);
        params.set(`${targetType}Period`, v);
        startTransition(() =>
          router.push(`/?${params.toString()}`, {
            scroll: false,
          })
        );
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{targetType} time</SelectLabel>
          {timePeriods.map((p) => (
            <SelectItem value={p}>{p}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
