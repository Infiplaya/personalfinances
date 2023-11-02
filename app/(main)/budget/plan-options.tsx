'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Edit2, MoreHorizontal, Trash } from 'lucide-react';

import { BudgetPlan } from '@/db/schema/finances';
import { useTransition } from 'react';
import { deleteBudgetPlan } from '@/app/actions';
import { toast } from 'sonner';
import { SheetTrigger } from '@/components/ui/sheet';

export default function PlanOptions({
  plan,
  handleRenamePlan,
}: {
  plan: BudgetPlan;
  handleRenamePlan: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDeletePlan(planId: string) {
    startTransition(async () => {
      const result = await deleteBudgetPlan(planId);
      result.success
        ? toast.success(result.message)
        : toast.error(result.message);
    });
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem
          disabled={isPending}
          onClick={() => handleDeletePlan(plan.id)}
        >
          <Trash className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />{' '}
          <span className="ml-2">Delete</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleRenamePlan}>
          <Edit className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />{' '}
          <span className="ml-2">Rename</span>
        </DropdownMenuItem>
        <SheetTrigger asChild>
          <DropdownMenuItem>
            <Edit2 className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />{' '}
            <span className="ml-2">Edit Plan</span>
          </DropdownMenuItem>
        </SheetTrigger>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
