import { Separator } from '@/components/ui/separator';
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { BudgetPlan, BudgetStatus } from '@/db/schema/finances';
import { PlanForm } from './plan-form';

export function EditPlan({
  item,
  statuses,
}: {
  item: BudgetPlan;
  statuses: BudgetStatus[];
}) {
  return (
    <SheetContent className="md:min-w-[1000px]">
      <SheetHeader>
        <SheetTitle>Edit Plan</SheetTitle>
        <SheetDescription>Make changes to this plan.</SheetDescription>
      </SheetHeader>
      <Separator className="mt-3" />
      <div className="mt-6">
        <PlanForm plan={item} statuses={statuses} />
      </div>
    </SheetContent>
  );
}