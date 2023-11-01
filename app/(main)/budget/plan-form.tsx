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
import { PlanForm, planFormSchema } from '@/lib/validation/budget';
import { Textarea } from '@/components/ui/textarea';
import { createStatusFromClient, updateBudgetPlan } from '@/app/actions';
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
import { useState, useTransition } from 'react';
import { v4 } from 'uuid';

type UpdatedStatus = Omit<BudgetStatus, 'createdAt'>;

export function PlanForm({
  plan,
  statuses,
}: {
  plan: BudgetPlan;
  statuses: UpdatedStatus[];
}) {
  const form = useForm<PlanForm>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: plan.name,
      description: plan.description ?? '',
      statusId: plan.statusId,
    },
  });

  const [query, setQuery] = useState('');
  const [updatedStatuses, setUpdatedStatuses] = useState(statuses);

  const [isPending, startTransition] = useTransition();

  async function handleEditPlan(data: PlanForm) {
    const result = await updateBudgetPlan(data, plan.id);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  const currentStatus = updatedStatuses.find((s) => s.id === plan.statusId)
    ?.name;

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
            <FormItem>
              <FormLabel>Status</FormLabel>
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
                        ? updatedStatuses.find((s) => s.id === field.value)
                            ?.name
                        : currentStatus}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder={`Search or create`}
                      className="h-9"
                      onValueChange={setQuery}
                      value={query}
                    />
                    <CommandEmpty>
                      <Button
                        variant="outline"
                        disabled={isPending}
                        onClick={() =>
                          startTransition(async () => {
                            const statusId = v4();
                            const result = await createStatusFromClient(
                              query,
                              statusId
                            );
                            if (result.success) {
                              toast.success(result.message);
                              form.setValue('statusId', statusId);
                              setUpdatedStatuses((prev) => [
                                {
                                  name: query,
                                  id: statusId,
                                  profileId: prev[0].profileId,
                                },
                                ...prev,
                              ]);
                              setQuery('');
                            } else {
                              toast.error(result.message);
                            }
                          })
                        }
                      >
                        {isPending ? 'Creating' : `Create status ${query}`}
                      </Button>
                    </CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                      {updatedStatuses.map((status) => (
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
