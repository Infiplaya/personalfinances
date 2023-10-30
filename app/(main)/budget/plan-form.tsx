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
import { BudgetPlan, BudgetStatus } from '@/db/schema/finances';
import { usePathname } from 'next/navigation';
import { PlanForm, planFormSchema } from '@/lib/validation/budget';
import { Textarea } from '@/components/ui/textarea';
import { updateBudgetPlan } from '@/app/actions';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CaretSortIcon } from '@radix-ui/react-icons';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { CheckIcon } from 'lucide-react';

export function PlanForm({
  plan,
  statuses,
}: {
  plan: BudgetPlan;
  statuses: BudgetStatus[];
}) {
  const form = useForm<PlanForm>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: plan.name,
      description: plan.description ?? '',
      statusId: plan.statusId,
    },
  });

  async function handleEditPlan(data: PlanForm) {
    const result = await updateBudgetPlan(data, plan.id);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  const currentStatus = statuses
    .filter((s) => s.id === plan.statusId)
    .map((s) => s.name)[0];

  console.log(currentStatus);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => handleEditPlan(data))}
        className="mt-3 space-y-8"
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="statusId"
          render={({ field }) => (
            <FormItem className="mt-2.5 flex flex-col">
              <FormLabel>status</FormLabel>
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
                        ? statuses.find((s) => s.id === field.value)?.name
                        : currentStatus}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder={`Search code`} className="h-9" />
                    <CommandEmpty>No status found.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                      {statuses.map((status) => (
                        <CommandItem
                          value={status.id}
                          key={status.id}
                          onSelect={() => {
                            form.setValue('statusId', status.id);
                          }}
                        >
                          {status.name}
                          <CheckIcon
                            className={cn(
                              'ml-auto h-4 w-4',
                              status.id === field.value
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
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Form>
  );
}
