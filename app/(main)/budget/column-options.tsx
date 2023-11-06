'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings2 } from 'lucide-react';
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
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { deleteBudgetColumn, deleteBudgetItems } from '@/db/actions/budgets';
import { BudgetStatus } from '@/db/schema/finances';

export default function ColumnOptions({ column }: { column: BudgetStatus }) {
  const [selectedTrigger, setSelectedTrigger] = useState<
    null | 'column' | 'items'
  >(null);
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings2 className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <AlertDialogTrigger
            asChild
            onClick={() => setSelectedTrigger('column')}
          >
            <DropdownMenuItem>Remove Column</DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogTrigger
            asChild
            onClick={() => setSelectedTrigger('items')}
          >
            <DropdownMenuItem>Clear Items</DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {selectedTrigger === 'column'
              ? 'This will delete this column and all the items.'
              : 'This will delete all items from this column'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form
            action={
              selectedTrigger === 'column'
                ? deleteBudgetColumn
                : deleteBudgetItems
            }
          >
            <Input type="hidden" value={column.id} name="columnId" />
            <AlertDialogAction type="submit">Delete</AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
