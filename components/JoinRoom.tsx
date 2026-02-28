"use client";

import { useState } from "react";
import { Lock, DoorOpen, Loader2 } from "lucide-react";

export default function JoinRoom({
    initialRoomId = "",
    onJoinSuccess
}: {
    initialRoomId?: string,
    // UPDATE THIS LINE:
    onJoinSuccess: (id: string) => void
}) {
    // ... inside handleJoin, this call will now be valid:

    const [roomId, setRoomId] = useState(initialRoomId);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-stone-100">
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
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 bg-stone-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none transition-all"
                        />
                        <Lock className="absolute right-4 top-4 text-stone-300" size={20} />
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

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