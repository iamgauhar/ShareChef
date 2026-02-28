"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UtensilsCrossed, Plus, LogIn } from "lucide-react";

export default function Home() {
  const [roomInput, setRoomInput] = useState("");
  const router = useRouter();

  const createRoom = async () => {
    // We'll build this API next
    const response = await fetch("/api/room/create", { method: "POST" });
    const data = await response.json();
    if (data.roomId) {
      router.push(`/room/${data.roomId}`);
    }
  };

  const joinRoom = () => {
    if (roomInput.trim()) {
      router.push(`/room/${roomInput.toUpperCase()}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Branding */}
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-orange-500 p-4 rounded-2xl shadow-lg">
            <UtensilsCrossed className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-stone-900 tracking-tight">ShareChef</h1>
          <p className="text-stone-500">Collaborative cooking, powered by AI.</p>
        </div>

        {/* Actions */}
        <div className="grid gap-4 mt-10">
          <button
            onClick={createRoom}
            className="flex items-center justify-center gap-2 bg-stone-900 text-white p-4 rounded-xl font-semibold hover:bg-stone-800 transition-all shadow-md"
          >
            <Plus size={20} /> Create New Room
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-4 text-stone-400 text-sm">or</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Room ID (e.g. AB123)"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              className="flex-1 p-4 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all uppercase"
            />
            <button
              onClick={joinRoom}
              className="bg-white border border-stone-200 p-4 rounded-xl font-semibold hover:bg-stone-50 transition-all"
            >
              <LogIn size={20} className="text-stone-600" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}