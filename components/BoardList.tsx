'use client';

import { DndContext, closestCorners, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import Board from './Board';
import CreateBoardForm from './CreateBoardForm';
import { useBoardStore } from '@/stores/useBoardStore';
import { useState } from 'react';

export default function BoardList() {
  const { boards, reorderBoards } = useBoardStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = boards.findIndex((board) => board.id === active.id);
      const newIndex = boards.findIndex((board) => board.id === over.id);
      reorderBoards(oldIndex, newIndex);
    }
  };

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={boards.map((board) => board.id)} strategy={rectSortingStrategy}>
          <div className={`flex gap-2 ${boards.length >= 5 ? 'flex-wrap' : 'overflow-x-auto'}`}>
            {boards.map((board) => (
              <div key={board.id} className="min-w-56 flex-shrink basis-1/5">
                <Board board={board} />
              </div>
            ))}
            <div className="min-w-56 flex-shrink basis-56">
              <CreateBoardForm />
            </div>
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <div className="min-w-56 flex-shrink basis-1/5 opacity-80">
              <Board board={boards.find((board) => board.id === activeId)!} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
