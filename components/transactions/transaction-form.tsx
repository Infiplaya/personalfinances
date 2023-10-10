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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

import { Category, Currency } from '@/db/schema/finances';
import {
  TransactionForm,
  transactionFormSchema,
} from '@/lib/validation/transaction';
import { Textarea } from '../ui/textarea';
import { createNewTransaction } from '@/app/actions';
import { CheckIcon } from 'lucide-react';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

export function TransactionForm({
  categories,
  currencies,
  currentCurrency,
  closeModal,
  type,
}: {
  categories: Category[];
  currencies: Currency[];
  currentCurrency: string;
  closeModal?: () => void;
  type: 'expense' | 'income';
}) {
  const form = useForm<TransactionForm>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: type,
      currencyCode: currentCurrency.toUpperCase(),
    },
  });

  return (
    <Form {...form}>
      <h3 className="py-4 font-semibold">Add new {type}</h3>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          const result = await createNewTransaction(data);
          if (result.success) {
            closeModal ? closeModal() : null;
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
        })}
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
                <Input
                  placeholder="Amount of transaction"
                  {...field}
                  inputMode="numeric"
                />
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
                        : currentCurrency.toUpperCase()}
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

        <FormField
          control={form.control}
          name="categoryName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${type} category`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem value={category.name} key={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short description (optional)</FormLabel>
              <FormControl>
                <Textarea className="resize-none" {...field} />
              </FormControl>
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
