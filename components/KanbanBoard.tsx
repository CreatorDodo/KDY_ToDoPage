'use client';

import { Header } from '@/components/ui/Header';
import BoardList from './BoardList';

export default function KanbanBoard() {
  return (
    <div className="min-h-screen bg-slate-200 p-3">
      <Header />
      <BoardList />
    </div>
  );
}
