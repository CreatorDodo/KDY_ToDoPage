'use client';

import { Header } from '@/components/ui/Header';
import BoardList from './BoardList';

export default function KanbanBoard() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Header />
      <BoardList />
    </div>
  );
}
