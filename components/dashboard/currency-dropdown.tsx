'use client';

import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Currency } from '@/db/schema/finances';
// @ts-ignore
import { experimental_useFormState as useFormState } from 'react-dom';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { changeCurrency } from '@/app/actions';

const initialState = {
  message: null,
};

function SubmitButton({ currency }: { currency: Currency }) {
  const { pending } = useFormStatus();

  return (
    <CommandItem
      onSelect={() => toast.success(`Changed currency to ${currency.name}`)}
      disabled={pending}
    >
      <button
        aria-disabled={pending}
        type="submit"
        className="ml-2 w-full text-left"
      >
        {currency.code}
      </button>
    </CommandItem>
  );
}

export function CurrencyDropdown({
  currencies,
  currentCurrency,
}: {
  currencies: Currency[];
  currentCurrency: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(changeCurrency, initialState);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {currentCurrency
            ? currencies.find((currency) => currency.code === currentCurrency)
                ?.code
            : 'Select currency...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent >
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandEmpty>No currency found.</CommandEmpty>
          <CommandGroup>
            {currencies.map((currency) => (
              <form action={formAction} key={currency.id}>
                <input
                  type="hidden"
                  id="code"
                  name="code"
                  value={currency.code}
                />
                <SubmitButton currency={currency} />
              </form>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

{
}
