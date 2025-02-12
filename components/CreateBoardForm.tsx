'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useBoardStore } from '@/stores/useBoardStore';

export default function CreateBoardForm() {
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const { addBoard } = useBoardStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBoardTitle.trim()) {
      addBoard(newBoardTitle.trim());
      setNewBoardTitle('');
      setIsAddingBoard(false);
    }
  };

  if (!isAddingBoard) {
    return (
      <button
        onClick={() => setIsAddingBoard(true)}
        className="w-64 rounded-lg border-2 border-dashed border-gray-300 p-4 text-gray-500 hover:border-gray-400 hover:text-gray-600"
      >
        <Plus className="mx-auto h-6 w-6" />
        <span className="mt-2 block text-sm">Add New Board</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-64 rounded-lg bg-white p-4 shadow-sm">
      <input
        type="text"
        value={newBoardTitle}
        onChange={(e) => setNewBoardTitle(e.target.value)}
        placeholder="Enter board title"
        className="w-full rounded border border-gray-300 p-2"
        autoFocus
      />
      <div className="mt-2 flex justify-end space-x-2">
        <button type="submit" className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
          Add
        </button>
        <button
          type="button"
          onClick={() => setIsAddingBoard(false)}
          className="rounded px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
