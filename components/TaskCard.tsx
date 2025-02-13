'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { Pencil, Trash2, GripVertical } from 'lucide-react';
import { useTaskStore } from '@/stores/useTaskStore';
import type { Task } from '@/types';

export default function TaskCard({ task, boardId }: { task: Task; boardId: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(task.content);
  const { updateTask, deleteTask } = useTaskStore();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleUpdateContent = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (content.trim()) {
      updateTask(boardId, task.id, content);
      setIsEditing(false);
    }
  };

  const handleDeleteTask = (e: React.MouseEvent, taskId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('정말로 이 Task를 삭제하시겠습니까?')) {
      deleteTask(boardId, taskId);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-lg border border-gray-200 bg-white p-2 shadow-sm sm:p-3 ${
        isDragging ? 'opacity-50' : ''
      } transition-shadow duration-200 ease-in-out hover:shadow-md`}
    >
      <div className="flex items-start gap-2">
        <div {...attributes} {...listeners} className={`mt-0.5 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>

        <div className="flex-1">
          {!isEditing && (
            <div className="absolute right-2 top-2 flex space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-500"
              >
                <Pencil className="h-3 w-3" />
              </button>
              <button
                onClick={(e) => handleDeleteTask(e, task.id)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          )}

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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(false);
                  }}
                  className="rounded bg-gray-300 px-2 py-1 text-sm text-gray-700"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="mr-8 whitespace-pre-wrap text-xs text-gray-800 sm:text-sm">{task.content}</p>
              <div className="mt-4 flex justify-end">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Image
                    src={task.createdBy.avatar}
                    alt={task.createdBy.name}
                    width={16}
                    height={16}
                    className="h-5 w-5 rounded-full border border-white shadow-sm"
                    priority
                  />
                  <span className="text-xs text-gray-500">{task.createdBy.name}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
