"use client";

import { useState, useEffect } from "react";
import { Lock, DoorOpen, Loader2 } from "lucide-react";
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

    // 4. Show a smooth loading state while verifying ownership
    if (isCheckingHost || sessionStatus === "loading") {
        return (
            <div className="max-w-md mx-auto p-12 flex flex-col items-center justify-center text-stone-400 bg-white rounded-3xl shadow-2xl border border-stone-100">
                <Loader2 className="animate-spin mb-4 text-orange-500" size={36} />
                <p className="text-sm font-bold tracking-widest uppercase animate-pulse text-stone-500">Unlocking Kitchen...</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-stone-100 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <DoorOpen size={32} />
            </div>

            <h2 className="text-2xl font-bold text-center mb-2">Join a Kitchen</h2>
            <p className="text-stone-500 text-center mb-8 text-sm">Enter the Room ID and Password shared by the host.</p>

            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-stone-400 uppercase ml-2">Room ID</label>
                    <input
                        type="text"
                        placeholder="e.g. YJPAF"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                        className="w-full p-4 bg-stone-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none transition-all font-mono font-bold uppercase"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-stone-400 uppercase ml-2">Room Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            className="w-full p-4 bg-stone-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none transition-all"
                        />
                        <Lock className="absolute right-4 top-4 text-stone-300" size={20} />
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm text-center font-bold animate-in slide-in-from-top-1">{error}</p>}

                <button
                    onClick={handleJoin}
                    disabled={loading || !roomId || !password}
                    className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-orange-600 disabled:bg-stone-200 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Enter Kitchen"}
                </button>
            </div>
        </div>
    );
}