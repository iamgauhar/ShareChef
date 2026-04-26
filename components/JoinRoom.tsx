"use client";

import { useState, useEffect } from "react";
import { Lock, DoorOpen, Loader2, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";

export default function JoinRoom({
    initialRoomId = "",
    onJoinSuccess
}: {
    initialRoomId?: string,
    onJoinSuccess: (id: string) => void
}) {
    // 1. Get the current user's session
    const { data: session, status: sessionStatus } = useSession();

    const [roomId, setRoomId] = useState(initialRoomId);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 2. Add a checking state so the form doesn't flash before bypassing
    const [isCheckingHost, setIsCheckingHost] = useState(!!initialRoomId);

    // 3. Auto-Bypass Logic for the Creator
    useEffect(() => {
        const checkHostAccess = async () => {
            if (!initialRoomId) {
                setIsCheckingHost(false);
                return;
            }

            try {
                const res = await fetch(`/api/room/status?roomId=${initialRoomId}`, {
                    cache: "no-store"
                });

                if (res.ok) {
                    const data = await res.json();

                    // If logged-in user is the owner, auto-trigger success!
                    if (session?.user?.email && session.user.email === data.owner) {
                        onJoinSuccess(initialRoomId.toUpperCase());
                        return; // We don't set isCheckingHost to false here so it transitions smoothly
                    }
                }
            } catch (err) {
                console.error("Failed to verify host access", err);
            }

            // If they aren't the host, stop checking and show the form
            setIsCheckingHost(false);
        };

        if (sessionStatus !== "loading") {
            checkHostAccess();
        }
    }, [initialRoomId, session, sessionStatus, onJoinSuccess]);

    const handleJoin = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/room/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roomId: roomId.toUpperCase(), password }),
            });

            const data = await res.json();

            if (res.ok) {
                onJoinSuccess(roomId.toUpperCase());
            } else {
                setError(data.error || "Failed to join room");
            }
        } catch (err) {
            setError("Connection error. Try again.");
        } finally {
            setLoading(false);
        }
    };

    // Shared input styling to match CreateRoom
    const inputClasses = "w-full p-4 bg-stone-50 dark:bg-zinc-950/50 text-stone-900 dark:text-zinc-100 border border-stone-200/50 dark:border-zinc-800/80 focus:border-orange-500 dark:focus:border-orange-500/80 focus:ring-4 focus:ring-orange-500/10 rounded-2xl outline-none transition-all placeholder:text-stone-400 dark:placeholder:text-zinc-600 shadow-inner";
    const labelClasses = "text-[10px] font-black text-stone-400 dark:text-zinc-500 uppercase tracking-widest ml-2 mb-1.5 block";

    // 4. Show a smooth loading state while verifying ownership
    if (isCheckingHost || sessionStatus === "loading") {
        return (
            <div className="w-full max-w-md mx-auto p-12 flex flex-col items-center justify-center bg-white/80 dark:bg-zinc-900/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-stone-200/50 dark:shadow-none border border-stone-200/60 dark:border-zinc-800/80 transition-colors duration-500 animate-in fade-in duration-500">
                <Loader2 className="animate-spin mb-6 text-orange-500" size={40} />
                <p className="text-[11px] font-black tracking-[0.2em] uppercase animate-pulse text-stone-500 dark:text-zinc-400">
                    Authorizing Access...
                </p>
            </div>
        );
    }

    return (
        <>

            {/* Header Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-zinc-800 dark:to-zinc-950 text-stone-900 dark:text-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-[-3deg] hover:rotate-0 transition-transform duration-300 border border-white/50 dark:border-zinc-700/50">
                <DoorOpen size={32} className="text-orange-500" />
            </div>

            <h2 className="text-2xl font-black text-center mb-2 text-stone-900 dark:text-zinc-100 tracking-tight">
                Join a Kitchen
            </h2>
            <p className="text-stone-500 dark:text-zinc-400 text-center mb-8 text-sm font-medium">
                Enter the Room ID and Password shared by the host.
            </p>

            <div className="space-y-5">
                <div>
                    <label className={labelClasses}>Room ID</label>
                    <input
                        type="text"
                        placeholder="e.g. YJPAF"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                        className={`${inputClasses} font-mono font-bold tracking-widest uppercase text-center`}
                    />
                </div>

                <div>
                    <label className={labelClasses}>Room Password</label>
                    <div className="relative group">
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            className={inputClasses}
                        />
                        <Lock className="absolute right-4 top-4 text-stone-400 dark:text-zinc-500 group-focus-within:text-orange-500 transition-colors" size={18} />
                    </div>
                </div>

                {/* Premium Error State */}
                {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl animate-in slide-in-from-top-2 duration-300">
                        <AlertCircle className="text-red-500 dark:text-red-400 shrink-0" size={16} />
                        <p className="text-sm font-bold text-red-600 dark:text-red-400">
                            {error}
                        </p>
                    </div>
                )}

                <button
                    onClick={handleJoin}
                    disabled={loading || !roomId || !password}
                    className="w-full py-4 bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-2xl font-black text-lg hover:scale-[1.02] hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white disabled:hover:scale-100 disabled:opacity-50 disabled:bg-stone-200 dark:disabled:bg-zinc-800 disabled:text-stone-400 dark:disabled:text-zinc-600 transition-all flex items-center justify-center gap-2 mt-2 shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:shadow-none"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        "Enter Kitchen"
                    )}
                </button>
            </div>
        </>
    );
}