'use client';

import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Board from './Board';
import CreateBoardForm from './CreateBoardForm';
import { useBoardStore } from '@/stores/useBoardStore';

export default function BoardList() {
  const { boards, reorderBoards } = useBoardStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = boards.findIndex((board) => board.id === active.id);
      const newIndex = boards.findIndex((board) => board.id === over.id);
      reorderBoards(oldIndex, newIndex);
    }
  };

  return (
    <div className="p-4">
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <SortableContext items={boards.map((board) => board.id)} strategy={verticalListSortingStrategy}>
          <div className={`flex gap-2 ${boards.length >= 5 ? 'flex-wrap' : 'overflow-x-auto'}`}>
            {boards.map((board) => (
              <div key={board.id} className="min-w-56 flex-shrink basis-56">
                <Board board={board} />
              </div>
            ))}
            <div className="min-w-56 flex-shrink basis-56">
              <CreateBoardForm />
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
