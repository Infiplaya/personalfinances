'use client';
import React from 'react';
import { StrictModeDroppable } from './strict-droppable';
import { Task } from './task';

export function Column({ title, tasks, id }) {
  return (
    <div className="column">
      <h3>{title}</h3>
      <StrictModeDroppable droppableId={id}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <Task key={index} index={index} task={task} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </div>
  );
}
