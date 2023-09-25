'use client';
import { changeCurrentProfile } from '@/app/actions';
import { useTransition } from 'react';
import { Button } from './ui/button';

interface Profile {
  id: string;
  name: string;
  currencyCode: string;
  userId: string;
}

export function ProfileButton({
  profile,
  currentProfile,
}: {
  profile: Profile;
  currentProfile: Profile;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant={currentProfile.name === profile.name ? 'default' : 'outline'}
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await changeCurrentProfile(profile.name);
        })
      }
    >
      {profile.name}
    </Button>
  );
}
