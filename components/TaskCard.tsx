'use client';

import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { type Task } from '@/types';
import { UserCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onUpdateTask?: (id: string, content: string) => void;
  onDeleteTask?: (id: string) => void;
  boardId?: string;
}

export default function TaskCard({ task, onUpdateTask, onDeleteTask, boardId }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(task.content);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: {
      type: 'Task',
      task,
      board: { id: boardId },
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleUpdateContent = () => {
    if (onUpdateTask) {
      onUpdateTask(task.id, content);
    }
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`rounded-lg border border-gray-200 bg-white p-3 shadow-sm ${isDragging ? 'cursor-grabbing shadow-lg' : 'cursor-grab'} transition-shadow duration-200`}
    >
      {isEditing ? (
        <div className="flex flex-col">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-2 w-full rounded border p-1"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <button onClick={handleUpdateContent} className="text-sm text-blue-500">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="text-sm text-gray-500">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-3 text-sm text-gray-800">{task.content}</p>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              <div key={task.createdBy.id} className="relative">
                <UserCircle className="h-6 w-6 rounded-full bg-white text-gray-400" />
              </div>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => setIsEditing(true)} className="text-xs text-gray-500 hover:text-gray-700">
                Edit
              </button>
              {onDeleteTask && (
                <button onClick={() => onDeleteTask(task.id)} className="text-xs text-gray-500 hover:text-red-500">
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
