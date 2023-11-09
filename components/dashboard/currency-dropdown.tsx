'use client';

import { CheckIcon, ChevronsUpDown } from 'lucide-react';
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
// @ts-expect-error experimental hook
import { useFormState } from 'react-dom';
// @ts-expect-error experimental hook
import { useFormStatus } from 'react-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { changeCurrency } from '@/db/actions/currencies';
import { cn } from '@/lib/utils';

const initialState = {
  message: null,
};

function SubmitButton({
  currency,
  isSelected,
}: {
  currency: Currency;
  isSelected: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <CommandItem
      onSelect={() => toast.success(`Changed currency to ${currency.name}`)}
      disabled={pending}
    >
      <button
        aria-disabled={pending}
        type="submit"
        className={cn(
          'inline-flex w-full items-center space-x-2 text-left',
          isSelected ? 'font-semibold' : null
        )}
      >
        <span>{currency.code}</span>
        {isSelected ? <CheckIcon className="ml-2 h-5 w-5" /> : null}
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
  const [, formAction] = useFormState(changeCurrency, initialState);

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
      <PopoverContent>
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
                <SubmitButton
                  currency={currency}
                  isSelected={currency.code === currentCurrency}
                />
              </form>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
