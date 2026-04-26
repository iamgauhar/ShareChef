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

    // Shared input styling for consistency
    const inputClasses = "w-full p-4 bg-stone-50 dark:bg-zinc-950/50 text-stone-900 dark:text-zinc-100 border border-stone-200/50 dark:border-zinc-800/80 focus:border-orange-500 dark:focus:border-orange-500/80 focus:ring-4 focus:ring-orange-500/10 rounded-2xl outline-none transition-all placeholder:text-stone-400 dark:placeholder:text-zinc-600 shadow-inner";
    const labelClasses = "text-[10px] font-black text-stone-400 dark:text-zinc-500 uppercase tracking-widest ml-2 mb-1.5 block";

    return (
        <>

            {/* Header Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-stone-800 to-stone-950 dark:from-zinc-800 dark:to-zinc-950 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
                <ChefHat size={32} className="text-orange-400" />
            </div>

            <h2 className="text-2xl font-black text-center mb-2 text-stone-900 dark:text-zinc-100 tracking-tight">
                Kitchen Settings
            </h2>
            <p className="text-stone-500 dark:text-zinc-400 text-center mb-8 text-sm font-medium">
                Define the rules for your collaborative meal.
            </p>

            <form onSubmit={handleCreate} className="space-y-6">
                {/* Chef Name & Password Grid */}
                <div className="space-y-5">
                    <div>
                        <label className={labelClasses}>Your Chef Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Gordon Ramsay"
                            value={creatorName}
                            onChange={(e) => setCreatorName(e.target.value)}
                            className={inputClasses}
                        />
                    </div>

                    <div>
                        <label className={labelClasses}>Room Password</label>
                        <div className="relative group">
                            <input
                                type="password"
                                required
                                placeholder="For your guests"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputClasses}
                            />
                            <Lock className="absolute right-4 top-4 text-stone-400 dark:text-zinc-500 group-focus-within:text-orange-500 transition-colors" size={18} />
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-stone-100 dark:bg-zinc-800/50" />

                {/* Dietary & Allergies Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClasses}>Dietary</label>
                        <div className="relative group">
                            <select
                                value={dietary}
                                onChange={(e) => setDietary(e.target.value)}
                                className={`${inputClasses} appearance-none cursor-pointer text-sm font-medium`}
                            >
                                <option value="None" className="bg-white dark:bg-zinc-900">None</option>
                                <option value="Vegetarian" className="bg-white dark:bg-zinc-900">Vegetarian</option>
                                <option value="Vegan" className="bg-white dark:bg-zinc-900">Vegan</option>
                                <option value="Keto" className="bg-white dark:bg-zinc-900">Keto</option>
                                <option value="Halal" className="bg-white dark:bg-zinc-900">Halal</option>
                            </select>
                            <Leaf className="absolute right-4 top-4 text-stone-400 dark:text-zinc-500 group-focus-within:text-orange-500 transition-colors pointer-events-none" size={18} />
                        </div>
                    </div>
                    <div>
                        <label className={labelClasses}>Allergies</label>
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Peanuts, etc."
                                value={allergies}
                                onChange={(e) => setAllergies(e.target.value)}
                                className={`${inputClasses} text-sm`}
                            />
                            <ShieldAlert className="absolute right-4 top-4 text-stone-400 dark:text-zinc-500 group-focus-within:text-orange-500 transition-colors" size={18} />
                        </div>
                    </div>
                </div>

                {/* Time Limit Slider */}
                <div className="bg-stone-50 dark:bg-zinc-950/40 p-5 rounded-2xl border border-stone-100 dark:border-zinc-800/50">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-[10px] font-black text-stone-400 dark:text-zinc-500 uppercase tracking-widest">
                            Time Limit
                        </label>
                        <span className="text-xs font-bold bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 px-3 py-1 rounded-full flex items-center gap-1.5">
                            <Clock size={12} /> {timeLimit} mins
                        </span>
                    </div>
                    <input
                        type="range"
                        min="15"
                        max="120"
                        step="5"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(e.target.value)}
                        className="w-full h-2 bg-stone-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-stone-400 dark:text-zinc-600 mt-2 px-1">
                        <span>15m</span>
                        <span>60m</span>
                        <span>120m</span>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !password || !creatorName}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-black text-lg hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-50 disabled:from-stone-300 disabled:to-stone-400 dark:disabled:from-zinc-800 dark:disabled:to-zinc-800 disabled:text-stone-500 dark:disabled:text-zinc-600 transition-all flex items-center justify-center gap-2 mt-6 shadow-lg shadow-orange-500/20 disabled:shadow-none border border-transparent dark:disabled:border-zinc-700"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            <Sparkles size={20} />
                            <span>Launch Kitchen</span>
                        </>
                    )}
                </button>
            </form>
        </>
    );
}