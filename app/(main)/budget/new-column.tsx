'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '../settings/submit-button';
import { createBudgetColumn } from '@/db/actions/budgets';
// @ts-expect-error experimental hook
import {  useFormState } from 'react-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';

const initialState = {
  success: null,
  message: null,
};

export function NewColumn() {
  const [state, formAction] = useFormState(createBudgetColumn, initialState);

  useEffect(() => {
    if (state.success === false) {
      toast.error(state.message);
    } else if (state.success === true) {
      toast.success(state.message);
    }
  }, [state]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>New Column</Button>
      </PopoverTrigger>
      <PopoverContent>
        <form
          action={formAction}
          className="flex items-center justify-between space-x-6"
        >
          <Input type="text" name="name" id="name" />
          <SubmitButton>Add</SubmitButton>
        </form>
      </PopoverContent>
    </Popover>
  );
}
