'use client';
import { updateBudgetPlanStatus } from '@/app/actions';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BudgetStatus } from '@/db/queries/budgets';
import { cn } from '@/lib/utils';
import React, { useState, useTransition } from 'react';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './strict-droppable';

const itemsFromBackend = [
  { id: '1', content: 'First task' },
  { id: '2', content: 'Second task' },
  { id: '3', content: 'Third task' },
  { id: '4', content: 'Fourth task' },
  { id: '5', content: 'Fifth task' },
];

const columnsFromBackend = [
  {
    name: 'Requested',
    items: itemsFromBackend,
  },
  {
    name: 'To do',
    items: [],
  },
  {
    name: 'In Progress',
    items: [],
  },
  {
    name: 'Done',
    items: [],
  },
];

export function Board({ data }: { data: BudgetStatus[] }) {
  const [columns, setColumns] = useState(data);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[Number(source.droppableId)];
      const destColumn = columns[Number(destination.droppableId)];
      const sourceItems = [...sourceColumn.budgetPlans];
      const [removed] = sourceItems.splice(source.index, 1);
      const destItems = [...destColumn.budgetPlans, removed];

      const updatedSourceColumn = {
        ...sourceColumn,
        budgetPlans: sourceItems,
      };
      const updatedDestColumn = {
        ...destColumn,
        budgetPlans: destItems,
      };

      // Create a copy of the columns array with the updated columns
      const updatedColumns = [...columns];
      updatedColumns[Number(source.droppableId)] = updatedSourceColumn;
      updatedColumns[Number(destination.droppableId)] = updatedDestColumn;

      // Update the state with the new columns array
      setColumns(updatedColumns);

      await updateBudgetPlanStatus(removed.id, destColumn.id);
    } else {
      const column = columns[Number(source.droppableId)];
      const copiedItems = [...column.budgetPlans];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns([...columns]);
    }
  };

  return (
    <div className="flex h-full items-center space-x-6 overflow-auto">
      <DragDropContext onDragEnd={async (result) => onDragEnd(result)}>
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div className="w-full rounded-md border-r-2" key={columnId}>
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
                        snapshot.isDraggingOver && 'border bg-gray-100'
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
                                    'mb-5 transition-all hover:bg-gray-100 dark:hover:bg-gray-800',
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
