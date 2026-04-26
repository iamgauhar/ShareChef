"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

type RoomDeletePopupProps = {
  roomId: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function RoomDeletePopup({
  roomId,
  isDeleting,
  onCancel,
  onConfirm,
}: RoomDeletePopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 dark:bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-8 rounded-[2rem] shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100 dark:border-red-500/20">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-2xl font-black text-center mb-2 text-stone-900 dark:text-zinc-100 tracking-tight">
          Delete Kitchen?
        </h3>
        <p className="text-stone-500 dark:text-zinc-400 text-center mb-8 text-sm font-medium leading-relaxed">
          Are you sure you want to permanently delete Room{" "}
          <span className="font-bold text-stone-900 dark:text-zinc-200">
            {roomId}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-3.5 bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-300 rounded-xl font-bold hover:bg-stone-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-3.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
          >
            {isDeleting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Yes, Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
