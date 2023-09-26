'use client';

import * as React from 'react';
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../ui/command';
import { changeCurrentProfile } from '@/app/actions';

interface Profile {
  id: string;
  name: string;
  currencyCode: string;
  userId: string;
}

export function ProfileSwitcher({
  children,
  profiles,
  currentProfile,
}: {
  children: React.ReactNode;
  profiles: Profile[];
  currentProfile: Profile;
}) {
  const [open, setOpen] = React.useState(false);
  const [showNewProfileDialog, setShowNewProfileDialog] = React.useState(false);
  const [selectedProfile, setselectedProfile] =
    React.useState<Profile>(currentProfile);
  const [isPending, startTransition] = React.useTransition();

  return (
    <Dialog open={showNewProfileDialog} onOpenChange={setShowNewProfileDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a profile"
            className={'w-[200px] justify-between'}
          >
            {selectedProfile.name}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search profile..." />
              <CommandEmpty>No profile found.</CommandEmpty>
              {profiles.map((p) => (
                <CommandItem
                  key={p.name}
                  disabled={isPending}
                  onSelect={() =>
                    startTransition(async () => {
                      await changeCurrentProfile(p.name);
                      setselectedProfile(p);
                      setOpen(false);
                    })
                  }
                  className="text-sm"
                >
                  {p.name}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      selectedProfile.id === p.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewProfileDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Profile
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {children}
    </Dialog>
  );
}
