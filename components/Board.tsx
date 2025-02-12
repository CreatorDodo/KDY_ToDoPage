'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTaskStore } from '@/stores/useTaskStore';
import Task from './Task';
import TaskCard from './TaskCard';
import CreateTaskForm from './CreateTaskForm';
import { Task as TaskType, type Board } from '@/types';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { Pencil, Trash2, GripVertical } from 'lucide-react';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

interface BoardProps {
  board: Board;
}

export default function Board({ board }: BoardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [title, setTitle] = useState(board.title);
  const [description, setDescription] = useState(board.description || '');
  const { reorderTasks } = useTaskStore();
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: board.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleUpdateTitle = () => {
    setIsEditing(false);
  };

  const handleUpdateDescription = () => {
    // 여기에 description 업데이트 로직 추가 필요
    setIsEditingDesc(false);
  };

  const handleDragStart = (event: any) => {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const activeType = active.data.current?.type;
      const overType = over?.data.current?.type;

      if (activeType === 'Task' && overType === 'Board') {
        const taskId = active.id;
        const sourceBoardId = active.data.current.board.id;
        const destinationBoardId = over.id;
        reorderTasks(sourceBoardId, destinationBoardId, taskId);
      }
    }

    setActiveTask(null);
  };

  function handleDeleteBoard(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`min-h-40 max-w-full rounded-lg bg-white p-2 shadow sm:p-3 md:p-4 ${isDragging ? 'cursor-grabbing opacity-50' : 'cursor-grab'} transition-shadow duration-200 hover:shadow-lg`}
    >
      <div className="mb-2 sm:mb-4">
        <div className="mb-1 flex items-center sm:mb-2">
          <GripVertical className="mr-1 h-4 w-4 text-gray-400 sm:mr-2 sm:h-5 sm:w-5" />
          {isEditing ? (
            <div className="flex flex-grow items-center space-x-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-grow rounded border p-1"
                autoFocus
              />
              <button onClick={handleUpdateTitle} className="text-blue-500">
                저장
              </button>
              <button onClick={() => setIsEditing(false)} className="text-gray-500">
                취소
              </button>
            </div>
          ) : (
            <div className="flex flex-grow items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold sm:text-base md:text-base">{board.title}</h3>
                <Image
                  src={board.createdBy.avatar}
                  alt={board.createdBy.name}
                  width={16}
                  height={16}
                  className="h-6 w-6 rounded-full border border-white shadow-sm"
                  priority
                />
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-blue-500">
                  <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <button onClick={() => handleDeleteBoard()} className="text-gray-500 hover:text-red-500">
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <div className="flex-grow">
            {isEditingDesc ? (
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
                onClick={() => setIsEditingDesc(true)}
                className="cursor-pointer text-xs text-gray-500 hover:text-gray-700 sm:text-sm"
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
            <Task key={task.id} task={task} boardId={board.id} />
          ))}
        </div>
        <DragOverlay>{activeTask && <TaskCard task={activeTask} />}</DragOverlay>
      </DndContext>
      <CreateTaskForm />
    </div>
  );
}
