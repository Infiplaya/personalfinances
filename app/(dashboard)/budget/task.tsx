'use client';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

export function Task({ task, index }) {
  return (
    <Draggable draggableId={`${task.id}`} key={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div style={{ display: 'flex', justifyContent: 'start', padding: 2 }}>
            <span>
              <small>
                #{task.id}
                {'  '}
              </small>
            </span>
          </div>
          <div
            style={{ display: 'flex', justifyContent: 'center', padding: 2 }}
          >
            <p>{task.title}</p>
          </div>
        </div>
      )}
    </Draggable>
  );
}
