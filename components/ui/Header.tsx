'use client';

import Image from 'next/image';
import { mockUsers } from '@/mocks/userData';

export function Header() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-semibold text-gray-900">Project Board</h1>
        <div className="flex -space-x-3">
          {mockUsers.map((user) => (
            <div key={user.id} className="relative inline-block">
              <Image
                src={user.avatar}
                alt={user.name}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full border border-white shadow-sm"
                priority
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
