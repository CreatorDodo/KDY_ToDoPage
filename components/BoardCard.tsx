'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { useTaskStore } from '@/stores/useTaskStore';
import { useBoardStore } from '@/stores/useBoardStore';
import TaskCard from './TaskCard';
import CreateTaskForm from './CreateTaskForm';
import type { Board, Task } from '@/types';
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { Pencil, Trash2, GripVertical, Check, X } from 'lucide-react';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

export default function BoardCard({ board }: { board: Board }) {
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(board.title);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [description, setDescription] = useState(board.description || '');
  const { updateBoardTitle, updateBoardDescription, deleteBoard } = useBoardStore();
  const { reorderTasks } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const DEFAULT_BOARD_IDS = ['todo', 'inProgress', 'done'] as const;
  const isDefaultBoard = DEFAULT_BOARD_IDS.includes(board.id as any);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: board.id,
  });

  const handleUpdateBoardTitle = () => {
    if (title.trim()) {
      updateBoardTitle(board.id, title);
      setIsEditing(false);
    }
  };

  const handleUpdateDescription = () => {
    updateBoardDescription(board.id, description);
    setIsEditingDesc(false);
  };

  const handleDeleteBoard = () => {
    if (window.confirm('정말로 이 보드를 삭제하시겠습니까?')) {
      deleteBoard(board.id);
    }
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: any) => {
    const { active } = event;
    if (active.data.current?.type === 'Task') {
      setActiveTask(active.data.current.task);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = board.tasks.findIndex((task) => task.id === active.id);
      const newIndex = board.tasks.findIndex((task) => task.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderTasks(board.id, oldIndex, newIndex);
      }
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-40 max-w-full rounded-lg bg-white p-2 shadow transition-shadow duration-200 hover:shadow-lg sm:p-3 md:p-4">
      <div className="mb-2 sm:mb-4">
        <div className="mb-1 flex items-center sm:mb-2">
          <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          >
            <GripVertical className="mr-1 h-4 w-4 text-gray-400 sm:mr-2 sm:h-5 sm:w-5" />
          </div>
          <div className="flex flex-grow items-center justify-between">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded border p-1 text-sm font-bold"
                    autoFocus
                  />
                  <div className="flex items-center gap-1">
                    <button onClick={handleUpdateBoardTitle} className="text-green-500 hover:text-green-600">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => setIsEditing(false)} className="text-red-500 hover:text-red-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-sm font-bold sm:text-base md:text-base">{board.title}</h3>
                  <Image
                    src={board.createdBy.avatar}
                    alt={board.createdBy.name}
                    width={16}
                    height={16}
                    className="h-6 w-6 rounded-full border border-white shadow-sm"
                    priority
                  />
                  {!isDefaultBoard && (
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-blue-500">
                        <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <button onClick={handleDeleteBoard} className="text-gray-500 hover:text-red-500">
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex-grow">
            {isEditingDesc && !isDefaultBoard ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex-grow rounded border p-1 text-sm"
                  placeholder="설명 추가..."
                  autoFocus
                />
                <button onClick={handleUpdateDescription} className="text-sm text-blue-500">
                  저장
                </button>
                <button onClick={() => setIsEditingDesc(false)} className="text-sm text-gray-500">
                  취소
                </button>
              </div>
            ) : (
              <p
                onClick={() => !isDefaultBoard && setIsEditingDesc(true)}
                className={`text-xs text-gray-500 sm:text-sm ${!isDefaultBoard ? 'cursor-pointer hover:text-gray-700' : ''}`}
              >
                {description || '설명 추가...'}
              </p>
            )}
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <div className="space-y-2">
          {board.tasks.map((task) => (
            <TaskCard key={task.id} task={task} boardId={board.id} />
          ))}
        </div>
        <DragOverlay dropAnimation={null}>
          {activeTask && (
            <div className="transform-none">
              <TaskCard task={activeTask} boardId={board.id} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
      <CreateTaskForm boardId={board.id} />
    </div>
  );
}
