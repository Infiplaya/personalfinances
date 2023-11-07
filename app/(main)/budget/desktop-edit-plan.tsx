import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { BudgetPlan, BudgetStatus } from '@/db/schema/finances';
import { X } from 'lucide-react';
import { PlanForm } from './plan-form';

export function EditPlanDesktop({
  item,
  statuses,
}: {
  item: BudgetPlan;
  statuses: BudgetStatus[];
}) {
  return (
    <SheetContent className="w-2/3 md:w-auto md:min-w-[1000px]">
      <SheetHeader>
        <div className="inline-flex justify-between">
          <div>
            <SheetTitle>Edit Plan</SheetTitle>
            <SheetDescription>Make changes to this plan.</SheetDescription>
          </div>
          <div>
            <SheetClose asChild>
              <Button variant="outline" size="icon">
                <X />
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetHeader>
      <Separator className="mt-3" />
      <div className="mt-6">
        <PlanForm plan={item} statuses={statuses} />
      </div>
    </SheetContent>
  );
}
