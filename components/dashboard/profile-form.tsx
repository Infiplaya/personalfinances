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
import { ProfileForm, profileFormSchema } from '@/lib/validation/auth';
import { Currency } from '@/db/schema/finances';
import { createNewProfile, updateUserProfile } from '@/app/actions';

export function ProfileForm({
  closeModal,
  currencies,
  currentCurrency,
  edit,
  name,
}: {
  closeModal?: () => void;
  currencies: Currency[];
  currentCurrency: string;
  edit?: boolean;
  name?: string;
}) {
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: edit ? { currencyCode: currentCurrency, name: name } : {},
  });

  async function handleEditProfile(data: ProfileForm) {
    const error = await updateUserProfile(data);

    if (error) {
      toast.error(error);
    } else {
      if (closeModal) closeModal();
      toast.success('Created new profile!');
    }
  }

  async function handleCreateProfile(data: ProfileForm) {
    const error = await createNewProfile(data);

    if (error) {
      toast.error(error);
    } else {
      if (closeModal) closeModal();
      toast.success('Created new profile!');
    }
  }

  return (
    <Form {...form}>
      {
        <h3 className="py-2 font-semibold">
          {edit ? 'Edit Profile' : 'Add Profile'}
        </h3>
      }
      <form
        onSubmit={form.handleSubmit((data) =>
          edit ? handleEditProfile(data) : handleCreateProfile(data)
        )}
        className="space-y-8"
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
          name="currencyCode"
          render={({ field }) => (
            <FormItem className="mt-2.5 flex flex-col">
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
                    <CommandInput placeholder={`Search code`} className="h-9" />
                    <CommandEmpty>No currency found.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
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
            {form.formState.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
