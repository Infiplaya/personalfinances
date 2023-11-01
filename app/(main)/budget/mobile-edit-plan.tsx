import { DrawerContent } from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';

import { BudgetPlan, BudgetStatus } from '@/db/schema/finances';
import { PlanForm } from './plan-form';

export function EditPlanMobile({
  item,
  statuses,
}: {
  item: BudgetPlan;
  statuses: BudgetStatus[];
}) {
  return (
    <DrawerContent>
      <div>
        <h3 className="text-lg font-semibold">Edit Plan</h3>
        <p>Make changes to this plan.</p>
      </div>
      <Separator className="mt-3" />
      <div className="mt-6">
        <PlanForm plan={item} statuses={statuses} />
      </div>
    </DrawerContent>
  );
}
