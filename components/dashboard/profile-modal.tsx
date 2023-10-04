'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { getCurrencies, getCurrentCurrency } from '@/db/queries/currencies';
import { SelectProfile } from '@/db/schema/auth';
import { Currency } from '@/db/schema/finances';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ProfileForm } from './profile-form';

export function ProfileModal({
  currencies,
  profile,
}: {
  currencies: Currency[];
  currentCurrency: string;
  profile: SelectProfile;
}) {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <Dialog onOpenChange={setShowDialog} open={showDialog}>
      <DialogTrigger>
        <Button variant="outline" size="icon" className="h-5 w-5">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <ProfileForm
          currencies={currencies}
          currentCurrency={profile.currencyCode}
          edit={true}
          name={profile.name}
          profileId={profile.id}
          closeModal={() => setShowDialog(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
