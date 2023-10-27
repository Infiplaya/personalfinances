'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';

import { BudgetPlan } from '@/db/schema/finances';
import { useTransition } from 'react';
import { deleteBudgetPlan } from '@/app/actions';
import { toast } from 'sonner';

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
        <Button
          size="icon"
          variant="outline"
          className="opacity-0 group-hover:bg-white group-hover:opacity-100 group-hover:dark:bg-gray-900"
        >
          <MoreHorizontal className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem
          disabled={isPending}
          onClick={() => handleDeletePlan(plan.id)}
        >
          <Trash className="h-4 w-4 text-gray-700 dark:text-gray-300" />{' '}
          <span className="ml-2">Delete</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleRenamePlan}>
          <Edit className="h-4 w-4 text-gray-700 dark:text-gray-300" />{' '}
          <span className="ml-2">Rename</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
