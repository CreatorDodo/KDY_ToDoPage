'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UserCircle } from 'lucide-react';
import type { Task as TaskType } from '@/types';

export default function Task({ task, boardId }: { task: TaskType; boardId: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(task.content);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
      board: { id: boardId },
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleUpdateContent = () => {
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`rounded-lg border border-gray-200 bg-white p-2 shadow-sm sm:p-3 ${isDragging ? 'cursor-grabbing opacity-50' : 'cursor-grab'} transition-shadow duration-200 ease-in-out hover:shadow-md`}
      onClick={() => !isEditing && setIsEditing(true)}
    >
      {isEditing ? (
        <div className="flex flex-col">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-2 w-full rounded border p-2"
            autoFocus
            rows={3}
          />
          <div className="flex justify-end space-x-2">
            <button onClick={handleUpdateContent} className="rounded bg-blue-500 px-2 py-1 text-sm text-white">
              저장
            </button>
            <button onClick={() => setIsEditing(false)} className="rounded bg-gray-300 px-2 py-1 text-sm text-gray-700">
              취소
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-2 whitespace-pre-wrap text-xs text-gray-800 sm:mb-3 sm:text-sm">{task.content}</p>
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <UserCircle className="h-5 w-5 text-gray-400 sm:h-6 sm:w-6" />
              <span className="text-xs text-gray-500 sm:text-sm">{task.createdBy.name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
