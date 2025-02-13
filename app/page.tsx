import KanbanBoard from '@/components/KanbanBoard';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-200">
      <div className="container mx-auto p-6">
        <KanbanBoard />
      </div>
    </main>
  );
}
