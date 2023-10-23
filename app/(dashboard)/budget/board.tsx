'use client';
import { updateBudgetPlanStatus } from '@/app/actions';
import { BudgetStatus } from '@/db/queries/budgets';
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
  const [isPending, startTransition] = useTransition();

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

      startTransition(async () => {
        await updateBudgetPlanStatus(removed.id, destColumn.id);
      });
    } else {
      const column = columns[Number(source.droppableId)];
      const copiedItems = [...column.budgetPlans];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns([...columns]);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
      <DragDropContext onDragEnd={async (result) => onDragEnd(result)}>
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              className={isPending ? 'opacity-50' : 'opacity-100'}
              key={columnId}
            >
              <h2>{column.name}</h2>
              <div style={{ margin: 8 }}>
                <StrictModeDroppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? 'lightblue'
                            : 'lightgrey',
                          padding: 4,
                          width: 250,
                          minHeight: 500,
                        }}
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
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: 'none',
                                      padding: 16,
                                      margin: '0 0 8px 0',
                                      minHeight: '50px',
                                      backgroundColor: snapshot.isDragging
                                        ? '#263B4A'
                                        : '#456C86',
                                      color: 'white',
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {item.name}
                                  </div>
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
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}
