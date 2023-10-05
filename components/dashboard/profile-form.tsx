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
import { SubmitHandler, useForm } from 'react-hook-form';
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

// @ts-ignore
import { experimental_useFormState as useFormState } from 'react-dom';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

const initialEditState = {
  success: null,
  message: null,
};
const initialCreateState = {
  success: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      aria-disabled={pending}
      type="submit"
      className="ml-2 w-full text-left"
    >
      Save
    </button>
  );
}

export function ProfileForm({
  closeModal,
  currencies,
  currentCurrency,
  edit,
  name,
  profileId,
}: {
  closeModal?: () => void;
  currencies: Currency[];
  currentCurrency: string;
  edit?: boolean;
  name?: string;
  profileId?: string;
}) {
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: edit
      ? { currencyCode: currentCurrency, name: name }
      : {
          currencyCode: currentCurrency,
        },
  });

  async function handleEditProfile(data: ProfileForm) {
    const result = await updateUserProfile(data, profileId);

    if (result.success) {
      closeModal ? closeModal() : null;
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  async function handleCreateProfile(data: ProfileForm) {
    const result = await createNewProfile(data);
    if (result.success) {
      closeModal ? closeModal() : null;
      toast.success(result.message);
    } else {
      toast.error(result.message);
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
        className="space-y-8 mt-3"
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
