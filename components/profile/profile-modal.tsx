'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { SelectProfile } from '@/db/schema/auth';
import { Currency } from '@/db/schema/finances';
import useMediaQuery from '@/lib/hooks/useMediaQuery';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { DrawerContent, DrawerRoot, DrawerTrigger } from '../ui/drawer';
import { ProfileForm } from './profile-form';

export function ProfileModal({
  currencies,
  profile,
  edit,
}: {
  currencies: Currency[];
  currentCurrency: string;
  profile: SelectProfile;
  edit: boolean;
}) {
  const [showDialog, setShowDialog] = useState(false);
  const { isMobile } = useMediaQuery();
  if (isMobile) {
    return (
      <DrawerRoot onOpenChange={setShowDialog} open={showDialog}>
        {edit ? (
          <DrawerTrigger disabled={profile.name === 'default'}>
            <Edit className="h-4 w-4" />
          </DrawerTrigger>
        ) : (
          <DrawerTrigger asChild>
            <Button size="sm">New Profile</Button>
          </DrawerTrigger>
        )}
        <DrawerContent>
          <ProfileForm
            currencies={currencies}
            currentCurrency={profile.currencyCode}
            edit={edit}
            name={profile.name}
            profileId={profile.id}
            closeModal={() => setShowDialog(false)}
          />
        </DrawerContent>
      </DrawerRoot>
    );
  }
  return (
    <Dialog onOpenChange={setShowDialog} open={showDialog}>
      {edit ? (
        <DialogTrigger disabled={profile.name === 'default'}>
          <Edit className="h-4 w-4" />
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button>New Profile</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <ProfileForm
          currencies={currencies}
          currentCurrency={profile.currencyCode}
          edit={edit}
          name={profile.name}
          profileId={profile.id}
          closeModal={() => setShowDialog(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
