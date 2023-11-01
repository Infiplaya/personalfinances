'use client';

import * as React from 'react';
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
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
import { ProfileForm } from './profile-form';
import { Currency } from '@/db/schema/finances';
// @ts-expect-error experimental hook
import { useFormState } from 'react-dom';
// @ts-expect-error experimental hook
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  name: string;
  currencyCode: string;
  userId: string;
}

const initialState = {
  message: null,
};

function SubmitButton({
  profile,
  changeSelectedProfile,
  selectedProfile,
}: {
  profile: Profile;
  changeSelectedProfile: () => void;
  selectedProfile: Profile;
}) {
  const { pending } = useFormStatus();
  const router = useRouter();

  return (
    <CommandItem
      onSelect={() => {
        changeSelectedProfile();
        router.refresh();
        toast.success(`Changed profile to ${profile.name}`);
      }}
      aria-disabled={pending}
      className="w-full"
    >
      <button
        aria-disabled={pending}
        type="submit"
        className="ml-2 w-full text-left"
      >
        {profile.name}
      </button>
      <CheckIcon
        className={cn(
          'ml-auto h-5 w-5',
          selectedProfile.id === profile.id ? 'opacity-100' : 'opacity-0'
        )}
      />
    </CommandItem>
  );
}

export function ProfileSwitcher({
  currencies,
  currentCurrency,
  profiles,
  currentProfile,
}: {
  currencies: Currency[];
  currentCurrency: string;
  profiles: Profile[];
  currentProfile: Profile;
}) {
  const [open, setOpen] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(false);
  const [selectedProfile, setSelectedProfile] =
    React.useState<Profile>(currentProfile);
  const [, formAction] = useFormState(changeCurrentProfile, initialState);

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
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
                <form action={formAction} key={p.id}>
                  <input type="hidden" id="name" name="name" value={p.name} />
                  <SubmitButton
                    selectedProfile={selectedProfile}
                    profile={p}
                    changeSelectedProfile={() => setSelectedProfile(p)}
                  />
                </form>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowDialog(true);
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
      <DialogContent>
        <ProfileForm
          currencies={currencies}
          closeModal={() => setShowDialog(false)}
          currentCurrency={currentCurrency}
        />
      </DialogContent>
    </Dialog>
  );
}
