'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { DrawerContent, DrawerRoot, DrawerTrigger } from '../ui/drawer';
import { Button } from '../ui/button';
import { Edit2 } from 'lucide-react';
import { TargetForm } from './target-form';
import { Currency, FinancialTarget } from '@/db/schema/finances';
import { TargetType, TimePeriod } from '@/db/queries/targets';

export function TargetModal({
  target,
  targetType,
  targetPeriod,
  currency,
  currencies,
  edit,
}: {
  target?: FinancialTarget;
  targetType: TargetType;
  targetPeriod: TimePeriod;
  currency: Currency['code'];
  currencies: Currency[];
  edit: boolean;
}) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DrawerRoot open={open} onOpenChange={setOpen} shouldScaleBackground>
        <DrawerTrigger asChild>
          {edit ? (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <span>Edit</span>{' '}
              <Edit2 className="h-3 w-3 text-neutral-700 dark:text-neutral-300" />
            </Button>
          ) : (
            <Button>Set New</Button>
          )}
        </DrawerTrigger>
        <DrawerContent>
          <TargetForm
            closeModal={() => setOpen(false)}
            edit={true}
            target={target}
            type={targetType}
            timePeriod={targetPeriod}
            currentCurrency={currency}
            currencies={currencies}
          />
        </DrawerContent>
      </DrawerRoot>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {edit ? (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <span>Edit</span>{' '}
            <Edit2 className="h-3 w-3 text-neutral-700 dark:text-neutral-300" />
          </Button>
        ) : (
          <Button>Set New</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <TargetForm
          closeModal={() => setOpen(false)}
          edit={true}
          target={target}
          type={targetType}
          timePeriod={targetPeriod}
          currentCurrency={currency}
          currencies={currencies}
        />
      </DialogContent>
    </Dialog>
  );
}
