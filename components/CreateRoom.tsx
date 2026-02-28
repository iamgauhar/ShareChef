"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, ChefHat, Loader2, Clock, ShieldAlert, Leaf } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CreateRoomForm() {
    const { data: session } = useSession();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [creatorName, setCreatorName] = useState(session?.user?.name || "");
    const [password, setPassword] = useState("");

    // Version 1.2 Constraint States
    const [dietary, setDietary] = useState("None");
    const [allergies, setAllergies] = useState("");
    const [timeLimit, setTimeLimit] = useState("30");

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/room/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    password,
                    creatorName,
                    creatorEmail: session?.user?.email,
                    constraints: { dietary, allergies, timeLimit }
                }),
            });

            const data = await res.json();

            if (res.ok) {
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
        <div className="max-w-md mx-auto p-8 bg-white rounded-[2.5rem] shadow-2xl border border-stone-100">
            <div className="w-16 h-16 bg-stone-900 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <ChefHat size={32} />
            </div>

            <h2 className="text-2xl font-bold text-center mb-2">Kitchen Settings</h2>
            <p className="text-stone-500 text-center mb-8 text-sm">
                Define the rules for your collaborative meal.
            </p>

            <form onSubmit={handleCreate} className="space-y-5">
                {/* Chef Name & Password */}
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2 mb-1 block">Your Chef Name</label>
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
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2 mb-1 block">Room Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                placeholder="For your guests"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 bg-stone-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none transition-all"
                            />
                            <Lock className="absolute right-4 top-4 text-stone-300" size={18} />
                        </div>
                    </div>
                </div>

                {/* Dietary & Allergies Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2 mb-1 block">Dietary</label>
                        <div className="relative">
                            <select
                                value={dietary}
                                onChange={(e) => setDietary(e.target.value)}
                                className="w-full p-4 bg-stone-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none appearance-none text-sm"
                            >
                                <option value="None">None</option>
                                <option value="Vegetarian">Vegetarian</option>
                                <option value="Vegan">Vegan</option>
                                <option value="Keto">Keto</option>
                                <option value="Halal">Halal</option>
                            </select>
                            <Leaf className="absolute right-4 top-4 text-stone-300 pointer-events-none" size={18} />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2 mb-1 block">Allergies</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Peanuts, etc."
                                value={allergies}
                                onChange={(e) => setAllergies(e.target.value)}
                                className="w-full p-4 bg-stone-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none text-sm"
                            />
                            <ShieldAlert className="absolute right-4 top-4 text-stone-300" size={18} />
                        </div>
                    </div>
                </div>

                {/* Time Limit Slider */}
                <div className="bg-stone-50 p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Time Limit</label>
                        <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
                            <Clock size={14} /> {timeLimit} mins
                        </span>
                    </div>
                    <input
                        type="range"
                        min="15"
                        max="120"
                        step="5"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(e.target.value)}
                        className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !password || !creatorName}
                    className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 disabled:bg-stone-200 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-orange-100"
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