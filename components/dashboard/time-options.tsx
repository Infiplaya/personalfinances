'use client';
import { usePathname, useRouter } from 'next/navigation';
import { TransitionStartFunction } from 'react';
import { Button } from '../ui/button';

export const timestamps = [
  {
    label: '24h',
    time: 1,
  },
  {
    label: '7d',
    time: 7,
  },
  {
    label: '30d',
    time: 30,
  },
];

export default function TimeOptions({
  isPending,
  startTransition,
  selectedTime,
  type,
}: {
  isPending: boolean;
  startTransition: TransitionStartFunction;
  selectedTime: (typeof timestamps)[number]['time'];
  type: 'balance' | 'overview';
}) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="space-x-2 inline-flex">
      {timestamps.map((t) => (
        <Button
          key={t.time}
          disabled={isPending}
          onClick={() => {
            const params = new URLSearchParams(window.location.search);
            params.set(type, String(t.time));

            startTransition(() =>
              router.push(`/${pathname}?${params.toString()}`, {
                scroll: false,
              })
            );
          }}
          size="sm"
          variant={
            selectedTime === t.time && !isPending ? 'default' : 'secondary'
          }
        >
          {t.label}
        </Button>
      ))}
    </div>
  );
}
