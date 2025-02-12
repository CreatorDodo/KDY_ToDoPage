import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Board } from '@/types';
import { mockUsers } from '@/mocks/userData';

const defaultBoards: Board[] = [
  {
    id: 'todo',
    title: 'Todo',
    tasks: [],
    createdBy: mockUsers[0],
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 0,
  },
  {
    id: 'inProgress',
    title: 'In Progress',
    tasks: [],
    createdBy: mockUsers[0],
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 1,
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [],
    createdBy: mockUsers[0],
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 2,
  },
];

interface BoardStore {
  boards: Board[];
  setBoards: (boards: Board[]) => void;
  addBoard: (title: string) => void;

  reorderBoards: (startIndex: number, endIndex: number) => void;
}

export const useBoardStore = create<BoardStore>()(
  persist(
    (set) => ({
      boards: defaultBoards,
      setBoards: (boards) => set({ boards }),
      addBoard: (title) =>
        set((state) => ({
          boards: [
            ...state.boards,
            {
              id: `board-${Date.now()}`,
              title,
              tasks: [],
              createdBy: mockUsers[0],
              createdAt: new Date(),
              updatedAt: new Date(),
              order: state.boards.length,
            },
          ],
        })),

      reorderBoards: (startIndex, endIndex) =>
        set((state) => {
          const newBoards = [...state.boards];
          const [selected] = newBoards.splice(startIndex, 1);
          newBoards.splice(endIndex, 0, selected);
          return { boards: newBoards };
        }),
    }),
    {
      name: 'board-storage',
      partialize: (state) => ({
        boards: state.boards,
        setBoards: state.setBoards,
        addBoard: state.addBoard,

        reorderBoards: state.reorderBoards,
      }),
    },
  ),
);
