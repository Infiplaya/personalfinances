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
      <SelectTrigger className="h-8 rounded-md space-x-2 px-3 text-xs">
        <SelectValue
          className="text-sm capitalize"
          defaultValue={searchParams.get(`${targetType}Period`) ?? 'Day'}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="capitalize">{targetType} time</SelectLabel>
          {timePeriods.map((p) => (
            <SelectItem key={p} value={p}>
              <span className="capitalize">{p}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
