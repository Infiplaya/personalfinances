'use client';

import { Button } from '@/components/ui/button';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending}>
      Add
    </Button>
  );
}
