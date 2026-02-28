"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { UtensilsCrossed, Plus, LogIn, ChefHat, History, Sparkles, Trash2, Share2 } from "lucide-react";
import CreateRoom from "@/components/CreateRoom";
import JoinRoom from "@/components/JoinRoom";

export default function Home() {
  const { data: session } = useSession();
  const [mode, setMode] = useState<"initial" | "create" | "join">("initial");
  const [myRooms, setMyRooms] = useState([]);

  useEffect(() => {
    if (session) {
      fetch("/api/room/my-rooms").then(res => res.json()).then(setMyRooms);
    }
  }, [session]);

  const deleteRoom = async (roomId: string) => {
    if (!confirm("Are you sure you want to delete this kitchen?")) return;

    const res = await fetch("/api/room/delete", {
      method: "DELETE",
      body: JSON.stringify({ roomId }),
    });

    if (res.ok) {
      // Refresh the list locally
      setMyRooms((prev) => prev.filter((r: any) => r.roomId !== roomId));
    }
  };

  const copyInvite = (roomId: string, password: string) => {
    const inviteText = `Join my kitchen on ShareChef!\n\nRoom ID: ${roomId}\nPassword: ${password}\nLink: https://sharechef.iamgauhar.in/room/${roomId}`;

    navigator.clipboard.writeText(inviteText);
    alert("Invite details copied to clipboard!");
  };

  return (
    <main className="min-h-screen bg-[#FDFCFB] p-6">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
          <UtensilsCrossed className="text-orange-500" /> ShareChef
        </div>
        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-stone-500">{session.user?.name}</span>
            <button onClick={() => signOut()} className="text-sm text-red-500 font-bold">Logout</button>
          </div>
        ) : (
          <button onClick={() => signIn("google")} className="bg-stone-900 text-white px-6 py-2 rounded-full font-bold text-sm">Sign Up / Login</button>
        )}
      </nav>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Content */}
        <div className="space-y-6">
          <h1 className="text-6xl font-black leading-tight text-stone-900">
            Cook with friends, <span className="text-orange-500 underline decoration-stone-200">anywhere.</span>
          </h1>
          <ul className="space-y-4">
            {[
              { icon: <Sparkles className="text-orange-500" />, text: "AI-Powered Recipe Generation" },
              { icon: <Plus className="text-orange-500" />, text: "Real-time Collaborative Lobby" },
              { icon: <ChefHat className="text-orange-500" />, text: "Vibrant Community Voting" }
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-stone-600 font-medium">
                {f.icon} {f.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Actions */}
        <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-stone-100">
          {mode === "initial" ? (
            <div className="grid gap-4">
              <button
                onClick={() => session ? setMode("create") : signIn("google")}
                className="w-full p-6 bg-orange-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-orange-600 transition-all"
              >
                <Plus size={24} /> Host New Kitchen
              </button>
              <button
                onClick={() => setMode("join")}
                className="w-full p-6 bg-stone-50 text-stone-900 rounded-2xl font-bold border-2 border-transparent hover:border-orange-500 transition-all flex items-center justify-center gap-3"
              >
                <LogIn size={24} /> Join with ID
              </button>
            </div>
          ) : mode === "create" ? (
            <CreateRoom />
          ) : (
            <JoinRoom onJoinSuccess={(id) => window.location.href = `/room/${id}`} />
          )}
        </div>
      </div>

      {/* Replace your current session && myRooms.map with this */}
      {session && myRooms.length > 0 && (
        <div className="max-w-4xl mx-auto mt-20 px-4">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-6 text-stone-800">
            <History className="text-stone-400" /> Your Past Kitchens
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {myRooms.map((room: any) => (
              <div key={room.roomId} className="p-6 bg-white border border-stone-100 rounded-[2rem] shadow-sm relative group hover:shadow-md transition-all">
                <button
                  onClick={() => deleteRoom(room.roomId)}
                  className="absolute top-4 right-4 p-2 text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Room ID</p>
                  <p className="text-2xl font-black text-stone-900">{room.roomId}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-50">
                  <p className="text-xs font-bold text-stone-400 uppercase">Password</p>
                  <p className="text-sm font-mono text-stone-600">{room.password}</p>
                </div>
                <button
                  onClick={() => window.location.href = `/room/${room.roomId}`}
                  className="mt-6 w-full py-3 bg-stone-50 text-stone-900 rounded-xl font-bold text-xs hover:bg-orange-500 hover:text-white transition-all"
                >
                  Enter Kitchen
                </button>
                <button
                  onClick={() => copyInvite(room.roomId, room.password)}
                  className="p-3 bg-stone-100 text-stone-600 rounded-xl hover:bg-stone-200 transition-all"
                  title="Copy Invite Link"
                >
                  <Share2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}