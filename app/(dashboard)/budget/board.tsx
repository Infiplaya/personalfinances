'use client';
import { updateBudgetOrder, updateBudgetPlanStatus } from '@/app/actions';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Columns } from '@/db/queries/budgets';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './strict-droppable';

export function Board({ data }: { data: Columns }) {
  const [columns, setColumns] = useState(data);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.budgetPlans];
      const destItems = [...destColumn.budgetPlans];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          budgetPlans: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          budgetPlans: destItems,
        },
      });

      await updateBudgetPlanStatus(removed.id, destColumn.id);
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.budgetPlans];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          budgetPlans: copiedItems,
        },
      });

      await updateBudgetOrder(copiedItems);
    }
  };

  return (
    <div className="flex h-full items-center gap-10 overflow-auto">
      <DragDropContext onDragEnd={async (result) => onDragEnd(result)}>
        {Object.entries(columns).map(([columnId, column]) => {
          return (
            <div className="w-full rounded-md" key={columnId}>
              <h3 className="scroll-m-20 px-4 pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0">
                {column.name}
              </h3>
              <StrictModeDroppable droppableId={columnId} key={columnId}>
                {(provided, snapshot) => {
                  return (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={cn(
                        'min-h-[500px] w-full rounded-md lg:p-4',
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
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}
