'use client';

import { useState } from 'react';
import { useTaskStore } from '@/stores/useTaskStore';

export default function CreateTaskForm({ boardId }: { boardId: string }) {
  const [content, setContent] = useState('');
  const { addTask } = useTaskStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(boardId, content);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a new task"
        className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="mt-2 w-full rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-600"
      >
        Add Task
      </button>
    </form>
  );
}
