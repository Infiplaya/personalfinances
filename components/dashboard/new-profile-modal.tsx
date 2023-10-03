import { DialogContent } from '@/components/ui/dialog';
import { getCurrencies, getCurrentCurrency } from '@/db/queries/currencies';
import { ProfileForm } from './profile-form';

export async function NewProfileModal() {
  const currencies = await getCurrencies();
  const currentCurrency = await getCurrentCurrency();

  return (
    <DialogContent>
      <ProfileForm
        currencies={currencies}
        currentCurrency={currentCurrency}
      />
    </DialogContent>
  );
}
