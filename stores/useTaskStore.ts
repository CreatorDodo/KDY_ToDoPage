'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task } from '@/types';
import { useBoardStore } from '@/stores/useBoardStore';
import { mockUsers } from '@/mocks/userData';

interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (boardId: string, content: string) => void;
  updateTask: (boardId: string, taskId: string, content: string) => void;
  deleteTask: (boardId: string, taskId: string) => void;
  reorderTasks: (boardId: string, startIndex: number, endIndex: number) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      setTasks: (tasks) => set({ tasks }),
      addTask: (boardId, content) =>
        set(() => {
          const { boards, setBoards } = useBoardStore.getState();
          const targetBoard = boards.find((board) => board.id === boardId);

          const newTask = {
            id: `task-${Date.now()}`,
            content: content,
            createdBy: mockUsers[0],
            createdAt: new Date(),
            updatedAt: new Date(),
            order: Math.max(...(targetBoard?.tasks.map((t) => t.order) || [-1])) + 1,
          };

          const newBoards = boards.map((board) =>
            board.id === boardId ? { ...board, tasks: [...board.tasks, newTask] } : board,
          );

          setBoards(newBoards);
          return {};
        }),

      updateTask: (boardId, taskId, content) =>
        set(() => {
          const { boards, setBoards } = useBoardStore.getState();
          const newBoards = boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  tasks: board.tasks.map((task) =>
                    task.id === taskId
                      ? {
                          ...task,
                          content,
                          updatedAt: new Date(),
                        }
                      : task,
                  ),
                }
              : board,
          );
          setBoards(newBoards);
          return {};
        }),

      deleteTask: (boardId, taskId) =>
        set(() => {
          const { boards, setBoards } = useBoardStore.getState();
          const targetBoard = boards.find((board) => board.id === boardId);
          const deletingTask = targetBoard?.tasks.find((task) => task.id === taskId);

          if (!deletingTask) return {};

          const newBoards = boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  tasks: board.tasks
                    .filter((task) => task.id !== taskId)
                    .map((task) => (task.order > deletingTask.order ? { ...task, order: task.order - 1 } : task)),
                }
              : board,
          );

          setBoards(newBoards);
          return {};
        }),

      reorderTasks: (boardId: string, startIndex: number, endIndex: number) =>
        set(() => {
          const { boards, setBoards } = useBoardStore.getState();
          const targetBoard = boards.find((board) => board.id === boardId);

          if (!targetBoard) return {};

          const newTasks = [...targetBoard.tasks];
          const [movedTask] = newTasks.splice(startIndex, 1);
          newTasks.splice(endIndex, 0, movedTask);

          const reorderedTasks = newTasks.map((task, index) => ({
            ...task,
            order: index,
          }));

          const newBoards = boards.map((board) => (board.id === boardId ? { ...board, tasks: reorderedTasks } : board));

          setBoards(newBoards);
          return {};
        }),
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({
        addTask: state.addTask,
        updateTask: state.updateTask,
        deleteTask: state.deleteTask,
        reorderTasks: state.reorderTasks,
      }),
    },
  ),
);
