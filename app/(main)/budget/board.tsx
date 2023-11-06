'use client';
import {
  createBudgetPlan,
  updateBudgetOrder,
  updateBudgetPlanStatus,
} from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Columns } from '@/db/queries/budgets';
import { cn } from '@/lib/utils';
import { useEffect, useOptimistic, useRef, useState } from 'react';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
// @ts-expect-error experimental hook
import { useFormState } from 'react-dom';
import { StrictModeDroppable } from './strict-droppable';
import { PlusCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ChangeColumnName } from './change-column-name';
import ColumnOptions from './column-options';
import { toast } from 'sonner';
import PlanCard from './plan-card';
import { NameForm } from './name-form';
import { Sheet } from '@/components/ui/sheet';
import { EditPlanDesktop } from './desktop-edit-plan';
import { BudgetStatus } from '@/db/schema/finances';
import { useIsMobile } from '@/hooks/useIsMobile';
import { DrawerRoot } from '@/components/ui/drawer';
import { EditPlanMobile } from './mobile-edit-plan';

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

  const isMobile = useIsMobile();

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

      await updateBudgetPlanStatus(removed.id, destColumn.id);

      await updateBudgetOrder(destItems);
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
    <div className="mt-10 flex min-h-[750px] w-full flex-col items-start gap-10 md:flex-row md:pr-8">
      <DragDropContext onDragEnd={async (result) => onDragEnd(result)}>
        {Object.entries(optimisticColumns).map(([columnId, column]) => {
          return (
            <div
              className="w-full min-w-[350px] rounded-md border bg-neutral-100 py-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
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
                    <PlusCircle className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
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
                        'min-h-[500px] w-full p-4',
                        snapshot.isDraggingOver &&
                          'bg-neutral-200 dark:bg-white/10'
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
                                  {isMobile ? (
                                    <DrawerRoot>
                                      <PlanCard
                                        provided={provided}
                                        snapshot={snapshot}
                                        item={item}
                                        isMobile={true}
                                      />
                                      <EditPlanMobile
                                        statuses={statuses}
                                        item={item}
                                      />
                                    </DrawerRoot>
                                  ) : (
                                    <Sheet>
                                      <PlanCard
                                        provided={provided}
                                        snapshot={snapshot}
                                        item={item}
                                        isMobile={false}
                                      />
                                      <EditPlanDesktop
                                        statuses={statuses}
                                        item={item}
                                      />
                                    </Sheet>
                                  )}
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
                        <PlusCircle className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
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
    </div>
  );
}
