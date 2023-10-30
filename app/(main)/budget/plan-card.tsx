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
// @ts-expect-error
import { experimental_useFormState as useFormState } from 'react-dom';
import { toast } from 'sonner';
import { Check, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SheetTrigger } from '@/components/ui/sheet';

const initialState = {
  success: null,
  message: null,
};

export default function PlanCard({
  provided,
  snapshot,
  item,
}: {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  item: BudgetPlan;
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
  return (
    <Card
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={cn(
        'group mb-5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800',
        snapshot.isDragging && 'bg-gray-100 dark:bg-gray-800'
      )}
    >
      <SheetTrigger asChild>
        <CardHeader>
          <div className="flex items-center justify-between">
            {renamePlan ? (
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
                <Button
                  type="submit"
                  variant="outline"
                  className="hover:bg-gray-200 dark:hover:bg-gray-900"
                  size="icon"
                >
                  <Check className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </Button>
                <Input type="hidden" value={item.id} name="planId" />
              </form>
            ) : (
              <CardTitle>{item.name}</CardTitle>
            )}
            <div className="flex items-center">
              <Button
                onClick={handleRenamePlan}
                size="icon"
                variant="outline"
                className={cn(
                  'opacity-0 group-hover:bg-white group-hover:opacity-100 group-hover:dark:bg-gray-900',
                  renamePlan && 'hidden'
                )}
              >
                <Edit2 className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </Button>
              <PlanOptions plan={item} handleRenamePlan={handleRenamePlan} />
            </div>
          </div>
          <CardDescription>{item.description}</CardDescription>
        </CardHeader>
      </SheetTrigger>
    </Card>
  );
}
