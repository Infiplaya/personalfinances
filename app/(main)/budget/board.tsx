'use client';
import {
  createBudgetPlan,
  updateBudgetOrder,
  updateBudgetPlanStatus,
} from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Columns } from '@/db/queries/budgets';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState, useTransition } from 'react';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
// @ts-expect-error
import { experimental_useFormState as useFormState } from 'react-dom';
import { StrictModeDroppable } from './strict-droppable';
import { PlusCircle, X } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { ChangeColumnName } from './change-column-name';
import ColumnOptions from './column-options';
import { toast } from 'sonner';
import { experimental_useOptimistic as useOptimistic } from 'react';
import PlanCard from './plan-card';
import { NameForm } from './name-form';
import { Sheet } from '@/components/ui/sheet';
import { EditPlan } from './edit-plan';
import { BudgetStatus } from '@/db/schema/finances';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const initialState = {
  success: null,
  message: null,
};

export function Board({
  data,
  statuses,
}: {
  data: Columns;
  statuses: BudgetStatus[];
}) {
  const [editedColumn, setEditedColumn] = useState<null | string>(null);
  const [displayForm, setDisplayForm] = useState(false);
  const nameInputRef = useRef<null | HTMLInputElement>(null);
  const [optimisticColumns, changeColumnItems] = useOptimistic<Columns>(data);
  const [state, newPlanAction] = useFormState(createBudgetPlan, initialState);

  function resetForm() {
    setEditedColumn(null);
    setDisplayForm(false);
  }

  useEffect(() => {
    if (state.success === false) {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
      toast.error(state.message);
    } else if (state.success === true) {
      resetForm();
      toast.success(state.message);
    }
  }, [state]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = data[source.droppableId];
      const destColumn = data[destination.droppableId];
      const sourceItems = [...sourceColumn.budgetPlans];
      const destItems = [...destColumn.budgetPlans];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      changeColumnItems({
        ...optimisticColumns,
        [source.droppableId]: {
          ...sourceColumn,
          budgetPlans: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          budgetPlans: destItems,
        },
      });

      toast.success('Changed plan status');

      await updateBudgetOrder(destItems);

      await updateBudgetPlanStatus(removed.id, destColumn.id);
    } else {
      const column = data[source.droppableId];
      const copiedItems = [...column.budgetPlans];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      changeColumnItems({
        ...optimisticColumns,
        [source.droppableId]: {
          ...column,
          budgetPlans: copiedItems,
        },
      });

      toast.success('Changed plan order');

      await updateBudgetOrder(copiedItems);
    }
  };

  function handleAddNewPlan(columnId: string) {
    setEditedColumn(columnId);
    setDisplayForm(true);
  }

  return (
    <ScrollArea>
      <div className="mt-10 flex w-full flex-col gap-10 md:flex-row">
        <DragDropContext onDragEnd={async (result) => onDragEnd(result)}>
          {Object.entries(optimisticColumns).map(([columnId, column]) => {
            return (
              <div
                className="w-full min-w-[350px] rounded-md border bg-gray-100 py-4 shadow-md dark:border-gray-800 dark:bg-gray-900"
                key={columnId}
              >
                <div className="mb-4 flex items-center justify-between px-6">
                  <ChangeColumnName column={column} />
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAddNewPlan(columnId)}
                    >
                      <PlusCircle className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                    </Button>
                    <ColumnOptions column={column} />
                  </div>
                </div>
                <Separator />
                <StrictModeDroppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={cn(
                          'h-full min-h-[500px] w-full md:p-4',
                          snapshot.isDraggingOver &&
                            'bg-gray-200 dark:bg-white/10'
                        )}
                      >
                        {displayForm && editedColumn === columnId ? (
                          <NameForm
                            newPlanAction={newPlanAction}
                            resetForm={resetForm}
                            nameInputRef={nameInputRef}
                            column={column}
                          />
                        ) : null}

                        {column.budgetPlans.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={String(item.id)}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div>
                                    <Sheet>
                                      <PlanCard
                                        provided={provided}
                                        snapshot={snapshot}
                                        item={item}
                                      />
                                      <EditPlan
                                        statuses={statuses}
                                        item={item}
                                      />
                                    </Sheet>
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                        <Button
                          variant="secondary"
                          className="flex w-full justify-start space-x-3"
                          onClick={() => handleAddNewPlan(columnId)}
                        >
                          <PlusCircle className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                          <span>New Plan</span>
                        </Button>
                      </div>
                    );
                  }}
                </StrictModeDroppable>
              </div>
            );
          })}
        </DragDropContext>
        <ScrollBar orientation="horizontal" />
      </div>
    </ScrollArea>
  );
}
