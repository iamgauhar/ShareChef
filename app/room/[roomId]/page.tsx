"use client";

import { useState } from "react";
import IngredientSection from "@/components/IngredientSection";
import JoinRoom from "@/components/JoinRoom";
import { useParams } from "next/navigation";
import { ChefHat, Hash, Activity } from "lucide-react";

export default function RoomPage() {
    const params = useParams();
    const roomId = params.roomId as string;

    // This state tracks if the user has entered the correct password or is auto-bypassed
    const [isAuthorized, setIsAuthorized] = useState(false);

    // UNAUTHORIZED STATE (Gatekeeper)
    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-[#FDFCFB] dark:bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
                {/* Ambient Background Glows to match Home Page */}
                <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 dark:bg-orange-600/15 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/10 dark:bg-rose-600/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="w-full max-w-md relative z-10">
                    <JoinRoom
                        // We pass the roomId from the URL automatically
                        initialRoomId={roomId}
                        onJoinSuccess={() => setIsAuthorized(true)}
                    />
                </div>
            </div>
        );
    }

    // AUTHORIZED STATE (Active Kitchen)
    return (
        <div className="min-h-screen bg-[#FDFCFB] dark:bg-zinc-950 p-6 relative overflow-hidden transition-colors duration-500">
            {/* Subtle top glow for the dashboard feel */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-orange-500/5 dark:bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 pt-4">

                {/* Dashboard Header Bar */}
                <div className="mb-8 p-6 bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl rounded-[2rem] border border-stone-200/60 dark:border-zinc-800/80 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 transition-colors duration-500 animate-in slide-in-from-top-4 duration-500">

                    {/* Left Side: Title & Status */}
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 text-white dark:text-zinc-950 shrink-0">
                            <ChefHat size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-stone-900 dark:text-zinc-100 tracking-tight mb-1">
                                Active Kitchen
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-bold text-stone-500 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                                    <Activity size={12} /> WebSocket Connected
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Room ID Badge */}
                    <div className="flex items-center gap-4 bg-stone-50 dark:bg-zinc-950/80 px-6 py-4 rounded-2xl border border-stone-200 dark:border-zinc-800/80 w-full md:w-auto justify-center shadow-inner">
                        <div className="flex items-center gap-2">
                            <Hash size={16} className="text-orange-500" />
                            <span className="text-[10px] font-black text-stone-400 dark:text-zinc-500 uppercase tracking-widest">
                                Room ID
                            </span>
                        </div>
                        <div className="h-6 w-px bg-stone-200 dark:bg-zinc-800" />
                        <span className="font-mono text-xl font-bold text-stone-900 dark:text-zinc-100 tracking-wider">
                            {roomId}
                        </span>
                    </div>
                </div>

                {/* The Core App */}
                <IngredientSection roomId={roomId} />

            </div>
        </div>
    );
}