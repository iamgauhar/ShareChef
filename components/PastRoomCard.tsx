"use client";

import { Share2, Trash2 } from "lucide-react";

export type PastRoom = {
  roomId: string;
  password: string;
};

type PastRoomCardProps = {
  room: PastRoom;
  onDelete: (roomId: string) => void;
  onCopyInvite: (roomId: string, password: string) => void;
  onEnter: (roomId: string) => void;
};

export default function PastRoomCard({
  room,
  onDelete,
  onCopyInvite,
  onEnter,
}: PastRoomCardProps) {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900/40 backdrop-blur-sm border border-stone-200 dark:border-zinc-800/80 rounded-[1.5rem] relative group hover:border-orange-500/50 dark:hover:border-orange-500/30 hover:shadow-xl dark:hover:shadow-none hover:bg-stone-50 dark:hover:bg-zinc-900/80 transition-all duration-300">
      <button
        onClick={() => onDelete(room.roomId)}
        className="absolute top-5 right-5 p-2 bg-stone-100 dark:bg-zinc-950 text-stone-400 dark:text-zinc-500 rounded-full hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 border border-stone-200 dark:border-zinc-800"
        aria-label={`Delete kitchen ${room.roomId}`}
      >
        <Trash2 size={16} />
      </button>

      <div className="space-y-1 mb-6">
        <p className="text-[10px] font-black text-orange-500/80 uppercase tracking-widest">
          Room ID
        </p>
        <p className="text-2xl font-black text-stone-900 dark:text-zinc-100 tracking-tight truncate pr-8">
          {room.roomId}
        </p>
      </div>

      <div className="mb-8 p-4 bg-stone-50 dark:bg-zinc-950/50 rounded-xl border border-stone-100 dark:border-zinc-800/50">
        <p className="text-[10px] font-black text-stone-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
          Host Password
        </p>
        <p className="text-sm font-mono text-stone-600 dark:text-zinc-300">
          {room.password}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onEnter(room.roomId)}
          className="flex-1 py-3 bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-xl font-bold text-sm hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white dark:hover:text-white transition-colors"
        >
          Enter Kitchen
        </button>
        <button
          onClick={() => onCopyInvite(room.roomId, room.password)}
          className="p-3 bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-300 rounded-xl hover:bg-stone-200 dark:hover:bg-zinc-700 transition-colors border border-stone-200 dark:border-zinc-700"
          title="Copy Invite Link"
          aria-label={`Copy invite for kitchen ${room.roomId}`}
        >
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
}
