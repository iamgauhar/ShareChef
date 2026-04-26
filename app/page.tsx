"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  UtensilsCrossed, Plus, LogIn, ChefHat, History, Sparkles,
  Trash2, Share2, ArrowRight, Moon, Sun
} from "lucide-react";
import CreateRoom from "@/components/CreateRoom";
import JoinRoom from "@/components/JoinRoom";

export default function Home() {
  const { data: session } = useSession();
  const [mode, setMode] = useState<"initial" | "create" | "join">("initial");
  const [myRooms, setMyRooms] = useState([]);

  // Theme Toggle State (Defaults to dark mode based on our previous design)
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (session) {
      fetch("/api/room/my-rooms")
        .then((res) => res.json())
        .then(setMyRooms);
    }
  }, [session]);

  const deleteRoom = async (roomId: string) => {
    if (!confirm("Are you sure you want to delete this kitchen?")) return;

    const res = await fetch("/api/room/delete", {
      method: "DELETE",
      body: JSON.stringify({ roomId }),
    });

    if (res.ok) {
      setMyRooms((prev) => prev.filter((r: any) => r.roomId !== roomId));
    }
  };

  const copyInvite = (roomId: string, password: string) => {
    const inviteText = `Join my kitchen on ShareChef!\n\nRoom ID: ${roomId}\nPassword: ${password}\nLink: https://sharechef.iamgauhar.in/room/${roomId}`;
    navigator.clipboard.writeText(inviteText);
    alert("Invite details copied to clipboard!");
  };

  return (
    // The outermost div toggles the "dark" class. 
    <div className={`${isDark ? "dark" : ""}`}>
      <main className="min-h-screen bg-[#FDFCFB] dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 font-sans selection:bg-orange-500/30 relative overflow-hidden transition-colors duration-500">

        {/* Background Ambient Glow (Adapts to theme) */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 dark:bg-orange-600/20 blur-[120px] rounded-full pointer-events-none transition-colors duration-500" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-rose-500/10 dark:bg-rose-600/10 blur-[120px] rounded-full pointer-events-none transition-colors duration-500" />

        <div className="relative z-10 p-6">
          {/* Navigation */}
          <nav className="max-w-6xl mx-auto flex justify-between items-center mb-16 pt-4">
            <div className="flex items-center gap-3 font-black text-2xl tracking-tighter">
              <div className="p-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-lg shadow-orange-500/20 text-white dark:text-zinc-950">
                <UtensilsCrossed size={24} />
              </div>
              <span>Share<span className="text-orange-500">Chef</span></span>
            </div>

            <div className="flex items-center gap-4">
              {/* Theme Toggle Button */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2.5 rounded-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-stone-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-all shadow-sm"
                aria-label="Toggle Theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {session ? (
                <div className="flex items-center gap-6 bg-white/80 dark:bg-zinc-900/80 px-6 py-2.5 rounded-full border border-stone-200 dark:border-zinc-800 backdrop-blur-md shadow-sm">
                  <span className="text-sm font-medium text-stone-600 dark:text-zinc-300">
                    {session.user?.name}
                  </span>
                  <div className="w-px h-4 bg-stone-300 dark:bg-zinc-700" />
                  <button
                    onClick={() => signOut()}
                    className="text-sm text-stone-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 font-bold transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn("google")}
                  className="bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-stone-800 dark:hover:bg-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-xl dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                >
                  Sign Up / Login
                </button>
              )}
            </div>
          </nav>

          {/* Hero Section */}
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center mb-24">
            {/* Left: Content */}
            <div className="space-y-8">
              <h1 className="text-6xl md:text-7xl font-black leading-[1.1] tracking-tighter">
                Cook with friends, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-rose-500">
                  anywhere.
                </span>
              </h1>
              <p className="text-lg text-stone-500 dark:text-zinc-400 font-medium max-w-md leading-relaxed">
                Experience the first real-time collaborative kitchen. Generate AI recipes, cast votes, and build menus with zero latency.
              </p>
              <ul className="space-y-5 pt-4">
                {[
                  { icon: <Sparkles size={20} className="text-orange-500 dark:text-orange-400" />, text: "Groq-Powered AI Recipe Generation" },
                  { icon: <Plus size={20} className="text-rose-500 dark:text-rose-400" />, text: "Zero-Latency Optimistic UI" },
                  { icon: <ChefHat size={20} className="text-orange-500 dark:text-orange-400" />, text: "Smart Role-Based Routing" }
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-4 text-stone-700 dark:text-zinc-300 font-semibold text-lg">
                    <div className="p-2 bg-white dark:bg-zinc-900 rounded-lg border border-stone-200 dark:border-zinc-800 shadow-sm dark:shadow-inner">
                      {f.icon}
                    </div>
                    {f.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Actions */}
            <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl shadow-stone-200/50 dark:shadow-none border border-stone-200/60 dark:border-zinc-800/50 relative overflow-hidden group transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                {mode === "initial" ? (
                  <div className="grid gap-5">
                    <button
                      onClick={() => session ? setMode("create") : signIn("google")}
                      className="w-full p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-black text-lg flex items-center justify-between hover:scale-[1.02] transition-transform shadow-lg shadow-orange-500/20"
                    >
                      <div className="flex items-center gap-4">
                        <Plus size={24} /> Host New Kitchen
                      </div>
                      <ArrowRight size={20} className="opacity-80" />
                    </button>
                    <button
                      onClick={() => setMode("join")}
                      className="w-full p-6 bg-stone-50 dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 rounded-2xl font-bold text-lg border border-stone-200 dark:border-zinc-800 hover:border-orange-500/50 dark:hover:border-orange-500/50 hover:bg-white dark:hover:bg-zinc-900 transition-all flex items-center justify-between group-hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <LogIn size={24} className="text-stone-400 dark:text-zinc-400" /> Join with ID
                      </div>
                    </button>
                  </div>
                ) : mode === "create" ? (
                  <CreateRoom />
                ) : (
                  <JoinRoom onJoinSuccess={(id) => window.location.href = `/room/${id}`} />
                )}
              </div>
            </div>
          </div>

          {/* Past Kitchens Grid */}
          {session && myRooms.length > 0 && (
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <History className="text-orange-500" size={24} />
                <h2 className="text-2xl font-black tracking-tight text-stone-900 dark:text-zinc-100">
                  Your Past Kitchens
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myRooms.map((room: any) => (
                  <div
                    key={room.roomId}
                    className="p-6 bg-white dark:bg-zinc-900/40 backdrop-blur-sm border border-stone-200 dark:border-zinc-800/80 rounded-[1.5rem] relative group hover:border-orange-500/50 dark:hover:border-orange-500/30 hover:shadow-xl dark:hover:shadow-none hover:bg-stone-50 dark:hover:bg-zinc-900/80 transition-all duration-300"
                  >
                    <button
                      onClick={() => deleteRoom(room.roomId)}
                      className="absolute top-5 right-5 p-2 bg-stone-100 dark:bg-zinc-950 text-stone-400 dark:text-zinc-500 rounded-full hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 border border-stone-200 dark:border-zinc-800"
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
                        onClick={() => window.location.href = `/room/${room.roomId}`}
                        className="flex-1 py-3 bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-xl font-bold text-sm hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white dark:hover:text-white transition-colors"
                      >
                        Enter Kitchen
                      </button>
                      <button
                        onClick={() => copyInvite(room.roomId, room.password)}
                        className="p-3 bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-300 rounded-xl hover:bg-stone-200 dark:hover:bg-zinc-700 transition-colors border border-stone-200 dark:border-zinc-700"
                        title="Copy Invite Link"
                      >
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}