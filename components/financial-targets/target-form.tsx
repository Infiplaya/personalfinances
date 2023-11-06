'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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

import { CheckIcon } from 'lucide-react';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import {
  TargetForm,
  targetFormSchema,
} from '@/lib/validation/financial-target';
import { Currency } from '@/db/schema/finances';
import { TargetType, TimePeriod } from '@/db/queries/targets';
import { createNewTarget } from '@/db/actions/targets';

export function TargetForm({
  type,
  currencies,
  currentCurrency,
  timePeriod,
}: {
  type: TargetType;
  timePeriod: TimePeriod;
  currencies: Currency[];
  currentCurrency: Currency['code'];
}) {
  const form = useForm<TargetForm>({
    resolver: zodResolver(targetFormSchema),
    defaultValues: {
      type,
      timePeriod,
      currencyCode: currentCurrency,
    },
  });

  async function handleCreateTarget(data: TargetForm) {
    const result = await createNewTarget(data);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <Form {...form}>
      <h3 className="py-4 font-semibold">Create new {type}</h3>
      <form
        onSubmit={form.handleSubmit((data) => handleCreateTarget(data))}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input {...field} inputMode="numeric" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timePeriod"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currencyCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? currencies.find((c) => c.code === field.value)?.code
                        : currentCurrency?.toUpperCase()}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder={`Search ${type}`}
                      className="h-9"
                    />
                    <CommandEmpty>No currency found.</CommandEmpty>

                    <CommandGroup className="max-h-72 overflow-auto">
                      {currencies.map((currency) => (
                        <CommandItem
                          value={currency.code}
                          key={currency.code}
                          onSelect={() => {
                            form.setValue('currencyCode', currency.code);
                          }}
                        >
                          {currency.code}
                          <CheckIcon
                            className={cn(
                              'ml-auto h-4 w-4',
                              currency.code === field.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="inline-flex w-full items-center justify-between">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Submitting' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
