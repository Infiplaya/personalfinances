import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { type Column } from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Spinner } from '../ui/spinner';

export type FilterOption = {
  id: number;
  name: string;
};

interface DataTableFacetedFilter<TData, TValue> {
  title: string;
  options: FilterOption[];
}

export function DataTableFacetedFilter<TData, TValue>({
  title,
  options,
}: DataTableFacetedFilter<TData, TValue>) {
  const params = useSearchParams();
  const selectedValues = new Set(
    title === 'category'
      ? params.get('category')?.split('.')
      : params.get('type')?.split('.')
  );

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.name))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.name}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.name}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {isPending ? <Spinner /> : null}
              {options.map((option) => {
                const isSelected = selectedValues.has(option.name);
                return (
                  <CommandItem
                    key={option.name}
                    onSelect={() => {
                      const params = new URLSearchParams(
                        window.location.search
                      );

                      if (isSelected) {
                        selectedValues.delete(option.name);
                      } else {
                        selectedValues.add(option.name);
                      }
                      const filterValues = Array.from(selectedValues);

                      if (selectedValues.size > 0) {
                        params.set(title, filterValues.join('.'));
                      } else {
                        params.delete(title);
                      }

                      startTransition(() => {
                        router.replace(`${pathname}?${params.toString()}`);
                      });
                    }}
                  >
                    <div
                      className={cn(
                        'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} aria-hidden="true" />
                    </div>
                    <span>{option.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      const params = new URLSearchParams(
                        window.location.search
                      );
                      params.delete(title);
                      startTransition(() => {
                        router.replace(`${pathname}?${params.toString()}`);
                      });
                    }}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
