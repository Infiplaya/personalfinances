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
import { ProfileModal } from '@/components/dashboard/profile-modal';
import { deleteProfile } from '@/app/actions';

export default async function ProfilesSettingsPage() {
  const userProfiles = await getUserProfiles();
  const currencies = await getCurrencies();
  const currentCurrency = await getCurrentCurrency();
  const currentProfile = await getCurrentProfile();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Manage Profiles</h3>
        <div className="flex items-baseline justify-between">
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
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-5 w-5"
                    disabled={userProfiles.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form action={deleteProfile.bind(null, profile.id)}>
                      <AlertDialogAction type="submit">
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
