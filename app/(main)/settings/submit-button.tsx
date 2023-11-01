'use client';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';
// @ts-expect-error experimental hook
import { useFormStatus } from 'react-dom';

export function SubmitButton({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {children}
    </Button>
  );
}
