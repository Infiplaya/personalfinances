'use client';
import {
  createBudgetPlan,
  updateBudgetOrder,
  updateBudgetPlanStatus,
} from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Columns } from '@/db/queries/budgets';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState, useTransition } from 'react';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
// @ts-expect-error
import { experimental_useFormState as useFormState } from 'react-dom';
import { StrictModeDroppable } from './strict-droppable';
import { PlusCircle } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { ChangeColumnName } from './change-column-name';
import ColumnOptions from './column-options';
import { toast } from 'sonner';
import { SubmitButton } from '../settings/submit-button';
import { experimental_useOptimistic as useOptimistic } from 'react';
import { BudgetPlan, BudgetStatus } from '@/db/schema/finances';

const initialState = {
  success: null,
  message: null,
};

export function Board({ data }: { data: Columns }) {
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

      await updateBudgetOrder(copiedItems);
    }
  };

  function handleAddNewPlan(columnId: string) {
    setEditedColumn(columnId);
    setDisplayForm(true);
  }

  console.log(optimisticColumns);
  return (
    <div className="mt-10 flex gap-10 overflow-auto">
      <DragDropContext onDragEnd={async (result) => onDragEnd(result)}>
        {Object.entries(optimisticColumns).map(([columnId, column]) => {
          return (
            <div className="w-full rounded-md bg-white/5 py-4" key={columnId}>
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
                        'mt-4 min-h-[500px] w-full rounded-md lg:p-4',
                        snapshot.isDraggingOver &&
                          'bg-gray-100 dark:bg-gray-900'
                      )}
                    >
                      {displayForm && editedColumn === columnId ? (
                        <Card
                          className={cn(
                            'mb-5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800'
                          )}
                        >
                          <CardHeader>
                            <form
                              action={newPlanAction}
                              className="flex items-center space-x-2"
                            >
                              <Input
                                type="text"
                                placeholder="Type name of plan..."
                                id="name"
                                name="name"
                                ref={nameInputRef}
                                autoFocus
                              />
                              <Input
                                type="hidden"
                                name="columnId"
                                id="columnId"
                                value={column.id}
                              />
                              <SubmitButton>Add</SubmitButton>
                            </form>
                          </CardHeader>
                        </Card>
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
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={cn(
                                    'mb-5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800',
                                    snapshot.isDragging &&
                                      'bg-gray-100 dark:bg-gray-800'
                                  )}
                                >
                                  <CardHeader>
                                    <CardTitle>{item.name}</CardTitle>
                                    <CardDescription>
                                      {item.description}
                                    </CardDescription>
                                  </CardHeader>
                                </Card>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </StrictModeDroppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}
