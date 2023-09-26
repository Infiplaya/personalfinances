import {
  DialogContent,
} from '@/components/ui/dialog';
import { getCurrencies, getCurrentCurrency } from '@/db/queries/currencies';
import { NewProfileForm } from './new-profile-form';

export async function NewProfileModal() {
  const currencies = await getCurrencies();
  const currentCurrency = await getCurrentCurrency();

  return (
    <DialogContent>
      <NewProfileForm
        currencies={currencies}
        currentCurrency={currentCurrency}
      />
    </DialogContent>
  );
}
