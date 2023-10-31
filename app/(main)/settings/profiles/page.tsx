import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getCurrentProfile, getUserProfiles } from '@/db/queries/auth';
import { X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { getCurrencies, getCurrentCurrency } from '@/db/queries/currencies';
import { ProfileModal } from '@/components/profile/profile-modal';
import { deleteProfile } from '@/app/actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profiles Settings',
  description: 'Manage your profiles',
};

async function getProfileSettingsData() {
  const userProfilesPromise = getUserProfiles();
  const currenciesPromise = getCurrencies();
  const currentCurrencyPromise = getCurrentCurrency();
  const currentProfilePromise = getCurrentProfile();

  const [userProfiles, currencies, currentCurrency, currentProfile] =
    await Promise.all([
      userProfilesPromise,
      currenciesPromise,
      currentCurrencyPromise,
      currentProfilePromise,
    ]);

  return {
    userProfiles,
    currencies,
    currentCurrency,
    currentProfile,
  };
}

export default async function ProfilesSettingsPage() {
  const { userProfiles, currencies, currentCurrency, currentProfile } =
    await getProfileSettingsData();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Manage Profiles</h3>
        <div className="flex flex-col items-baseline md:flex-row md:justify-between">
          <p className="text-muted-foreground text-sm">
            This are the settings for managing all of your profiles.
          </p>
          <ProfileModal
            currencies={currencies}
            currentCurrency={currentCurrency}
            profile={currentProfile}
            edit={false}
          />
        </div>
      </div>
      <Separator />
      <ul className="space-y-3">
        {userProfiles.map((profile) => (
          <li key={profile.id} className="flex w-full max-w-lg justify-between">
            <span className="font-medium">{profile.name}</span>
            <div className="space-x-3">
              <ProfileModal
                currencies={currencies}
                currentCurrency={currentCurrency}
                profile={profile}
                edit={true}
              />
              <AlertDialog>
                <AlertDialogTrigger
                  disabled={
                    userProfiles.length === 1 || profile.name === 'default'
                  }
                >
                  {' '}
                  <X className="h-4 w-4" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this profile from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form action={deleteProfile.bind(null, profile.id)}>
                      <AlertDialogAction
                        type="submit"
                        className="w-full md:w-auto"
                      >
                        Delete
                      </AlertDialogAction>
                    </form>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
