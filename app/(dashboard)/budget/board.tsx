'use client';
import {
  changeBudgetColumnName,
  deleteBudgetColumn,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { Columns } from '@/db/queries/budgets';
import { cn } from '@/lib/utils';
import React, { useTransition } from 'react';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { StrictModeDroppable } from './strict-droppable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Edit2, Settings2, Trash } from 'lucide-react';

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
import { Separator } from '@/components/ui/separator';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="sm" disabled={pending}>
      Change
    </Button>
  );
}

export function Board({ data }: { data: Columns }) {
  const [isPending, startTransition] = useTransition();

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

      startTransition(async () => {
        await updateBudgetPlanStatus(removed.id, destColumn.id);
      });
    } else {
      const column = data[source.droppableId];
      const copiedItems = [...column.budgetPlans];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      await updateBudgetOrder(copiedItems);

      startTransition(async () => {
        await updateBudgetOrder(copiedItems);
      });
    }
  };

  return (
    <div className="mt-10 flex items-center gap-10 overflow-auto">
      <DragDropContext onDragEnd={async (result) => onDragEnd(result)}>
        {Object.entries(data).map(([columnId, column]) => {
          return (
            <div className="w-full rounded-md bg-white/5 py-4" key={columnId}>
              <div className="mb-4 flex justify-between px-6">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="text-xl">
                      {column.name}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <form
                      action={changeBudgetColumnName}
                      className="flex items-center justify-between space-x-6"
                    >
                      <Input
                        type="text"
                        name="name"
                        defaultValue={column.name}
                      />
                      <Input type="hidden" name="columnId" value={column.id} />
                      <SubmitButton />
                    </form>
                  </PopoverContent>
                </Popover>

                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Settings2 className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem>Delete Column</DropdownMenuItem>
                      </AlertDialogTrigger>
                      <DropdownMenuItem>Delete Items</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will delete this column and all the items.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <form action={deleteBudgetColumn}>
                        <Input
                          type="hidden"
                          value={column.id}
                          name="columnId"
                        />
                        <AlertDialogAction type="submit">
                          Delete
                        </AlertDialogAction>
                      </form>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <Separator />

              {isPending ? (
                <Skeleton className="mt-4 h-[500px] w-full rounded-md opacity-50" />
              ) : (
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
              )}
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}
