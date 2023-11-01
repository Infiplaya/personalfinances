'use client';
import { changeBudgetPlanName } from '@/app/actions';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BudgetPlan } from '@/db/schema/finances';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import PlanOptions from './plan-options';
// @ts-expect-error experimental hook
import { useFormState } from 'react-dom';
import { toast } from 'sonner';
import { Check, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SheetTrigger } from '@/components/ui/sheet';
import { DrawerTrigger } from '@/components/ui/drawer';

const initialState = {
  success: null,
  message: null,
};

export default function PlanCard({
  provided,
  snapshot,
  item,
  isMobile,
}: {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  item: BudgetPlan;
  isMobile: boolean;
}) {
  const [renamePlan, setRenamePlan] = useState(false);
  const [state, editPlanName] = useFormState(
    changeBudgetPlanName,
    initialState
  );
  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    if (state.success === false) {
      toast.error(state.message);
    } else if (state.success === true) {
      toast.success(state.message);
    }
  }, [state]);

  function handleRenamePlan() {
    setRenamePlan(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  if (renamePlan) {
    return (
      <CardHeader>
        <div className="flex items-center justify-between">
          <form
            action={editPlanName}
            onSubmit={() => setRenamePlan(false)}
            className="mr-1 flex w-full items-center justify-between gap-5"
          >
            <Input
              type="text"
              defaultValue={item.name}
              className="bg-gray-50 font-semibold leading-none tracking-tight dark:bg-gray-900"
              name="name"
              ref={inputRef}
            />
            <Button type="submit" size="icon">
              <Check className="h-4 w-4 text-gray-300 dark:text-gray-700" />
            </Button>
            <Input type="hidden" value={item.id} name="planId" />
          </form>
        </div>
      </CardHeader>
    );
  }
  return (
    <Card
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={cn(
        'group mb-5 flex items-start justify-between transition-colors hover:bg-white dark:hover:bg-gray-950',
        snapshot.isDragging && 'bg-indigo-500/50 dark:bg-indigo-500/50'
      )}
    >
      {isMobile ? (
        <DrawerTrigger asChild>
          <CardHeader className="w-full">
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
        </DrawerTrigger>
      ) : (
        <SheetTrigger asChild>
          <CardHeader className="w-full">
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
        </SheetTrigger>
      )}

      <div className="flex items-center p-2">
        <Button onClick={handleRenamePlan} size="icon" variant="ghost">
          <Edit2 className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </Button>
        <PlanOptions plan={item} handleRenamePlan={handleRenamePlan} />
      </div>
    </Card>
  );
}
