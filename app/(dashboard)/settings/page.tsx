import { ProfileForm } from '@/components/profile/profile-form';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentProfile } from '@/db/queries/auth';
import { getCurrencies, getCurrentCurrency } from '@/db/queries/currencies';
import { Suspense } from 'react';

export default async function SettingsPage() {
  const currencies = await getCurrencies();
  const currentCurrency = await getCurrentCurrency();
  const currentProfile = await getCurrentProfile();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-muted-foreground text-sm">
          This are the settings for your currently selected profile.
        </p>
      </div>
      <Separator />
      <div className="max-w-lg">
        <ProfileForm
          edit={true}
          currencies={currencies}
          currentCurrency={currentCurrency}
          name={currentProfile.name}
        />
      </div>
    </div>
  );
}
