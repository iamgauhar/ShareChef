"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, ChefHat, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CreateRoomForm() {
    const { data: session } = useSession();
    const [password, setPassword] = useState("");
    const [creatorName, setCreatorName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/room/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password, creatorName, creatorEmail: session?.user?.email }),
            });

            const data = await res.json();

            if (res.ok) {
                // Redirect to the new room
                router.push(`/room/${data.roomId}`);
            } else {
                alert(data.error || "Failed to create room");
            }
        } catch (err) {
            console.error("Creation Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-stone-100">
            <div className="w-16 h-16 bg-stone-900 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <ChefHat size={32} />
            </div>

            <h2 className="text-2xl font-bold text-center mb-2">Host a Kitchen</h2>
            <p className="text-stone-500 text-center mb-8 text-sm">
                Set a password for your friends to join.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-stone-400 uppercase ml-2">Your Chef Name</label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. Gauhar"
                        value={creatorName}
                        onChange={(e) => setCreatorName(e.target.value)}
                        className="w-full p-4 bg-stone-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-stone-400 uppercase ml-2">Set Room Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            required
                            placeholder="Keep it simple"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 bg-stone-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none transition-all"
                        />
                        <Lock className="absolute right-4 top-4 text-stone-300" size={20} />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !password || !creatorName}
                    className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 disabled:bg-stone-200 transition-all flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <>
                            <Sparkles size={20} />
                            <span>Create Secured Room</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}