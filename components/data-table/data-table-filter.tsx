import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';
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
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Loader2 } from 'lucide-react';

export type FilterOption = {
  id: number;
  name: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

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
              {options.map((option) => {
                const isSelected = selectedValues.has(option.name);
                return (
                  <SelectItem
                    isSelected={isSelected}
                    selectedValues={selectedValues}
                    option={option}
                    title={title}
                    key={option.id}
                    pathname={pathname}
                    router={router}
                  />
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    disabled={isPending}
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

export default function SelectItem({
  option,
  selectedValues,
  isSelected,
  title,
  router,
  pathname,
}: {
  option: FilterOption;
  selectedValues: Set<string>;
  isSelected: boolean;
  title: string;
  router: AppRouterInstance;
  pathname: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <CommandItem
      key={option.name}
      disabled={isPending}
      onSelect={() => {
        const params = new URLSearchParams(window.location.search);
        isSelected
          ? selectedValues.delete(option.name)
          : selectedValues.add(option.name);

        const filterValues = Array.from(selectedValues);

        selectedValues.size > 0
          ? params.set(title, filterValues.join('.'))
          : params.delete(title);

        startTransition(() => {
          router.replace(`${pathname}?${params.toString()}`);
        });
      }}
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-gray-800 dark:text-gray-200" />
      ) : (
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
      )}

      <span>{option.name}</span>
    </CommandItem>
  );
}
