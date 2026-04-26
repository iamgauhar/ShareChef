"use client";

import { useEffect, useState } from "react";
import { Send, Sparkles, Plus, Users, Lock, ShieldAlert, Clock, Leaf, Info, Loader2, ChefHat } from "lucide-react";
import { pusherClient } from "@/lib/pusher-client";
import { useSession } from "next-auth/react";
import RecipeCard from "./RecipeCard";
import VotingStage from "./VotingStage";

export default function IngredientSection({ roomId }: { roomId: string }) {
    const { data: session, status: sessionStatus } = useSession();

    const [userName, setUserName] = useState("");
    const [isJoined, setIsJoined] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    const [ingredients, setIngredients] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [view, setView] = useState<"lobby" | "voting" | "cooking">("lobby");
    const [recipeOptions, setRecipeOptions] = useState<any[]>([]);
    const [winningRecipe, setWinningRecipe] = useState<any>(null);
    const [constraints, setConstraints] = useState<any>(null);
    const [isHost, setIsHost] = useState(false);
    const currentVoterId = session?.user?.email || userName;

    // Shared input styling for consistency
    const inputClasses = "w-full p-4 bg-stone-50 dark:bg-zinc-950/50 text-stone-900 dark:text-zinc-100 border border-stone-200/50 dark:border-zinc-800/80 focus:border-orange-500 dark:focus:border-orange-500/80 focus:ring-4 focus:ring-orange-500/10 rounded-2xl outline-none transition-all placeholder:text-stone-400 dark:placeholder:text-zinc-600 shadow-inner";

    useEffect(() => {
        const channel = pusherClient.subscribe(`room-${roomId}`);

        const handleRecipeFinalized = (data: any) => {
            if (data) {
                setWinningRecipe(data);
                setView("cooking");
            }
        };

        const handleVotingStarted = (data: any) => {
            const recipesArray = Array.isArray(data) ? data : (data.recipes || data.recipeOptions);
            if (Array.isArray(recipesArray) && recipesArray.length > 0) {
                setRecipeOptions(recipesArray);
                setView("voting");
            }
            setIsGenerating(false);
        };

        const handleIngredientAdded = (newIngredient: any) => {
            setIngredients((prev) => [...prev, newIngredient]);
        };

        channel.bind("recipe-finalized", handleRecipeFinalized);
        channel.bind("voting-started", handleVotingStarted);
        channel.bind("ingredient-added", handleIngredientAdded);

        return () => {
            channel.unbind("recipe-finalized", handleRecipeFinalized);
            channel.unbind("voting-started", handleVotingStarted);
            channel.unbind("ingredient-added", handleIngredientAdded);
            pusherClient.unsubscribe(`room-${roomId}`);
        };
    }, [roomId]);

    useEffect(() => {
        const syncRoomState = async () => {
            try {
                const res = await fetch(`/api/room/status?roomId=${roomId}`, {
                    cache: "no-store"
                });
                const data = await res.json();

                if (data.constraints) {
                    setConstraints(data.constraints);
                }

                if (session?.user?.email && session.user.email === data.owner) {
                    setUserName(session.user.name || "Host");
                    setIsJoined(true);
                    setIsHost(true);
                }

                if (data.status === "voting" && data.recipes) {
                    setRecipeOptions(data.recipes);
                    setView("voting");
                } else if (data.status === "completed" && data.winner) {
                    setWinningRecipe(data.winner);
                    setView("cooking");
                }
            } catch (error) {
                console.error("Failed to sync room data", error);
            } finally {
                setIsInitializing(false);
            }
        };

        if (sessionStatus !== "loading") {
            syncRoomState();
        }
    }, [roomId, session, sessionStatus]);

    const addIngredient = async () => {
        if (!input.trim()) return;
        await fetch("/api/room/add-ingredient", {
            method: "POST",
            body: JSON.stringify({
                roomId,
                ingredient: input,
                addedBy: userName || "Anonymous Chef",
            }),
        });
        setInput("");
    };

    const generateRecipeOptions = async () => {
        setIsGenerating(true);
        try {
            await fetch("/api/room/generate", {
                method: "POST",
                body: JSON.stringify({ roomId }),
            });
        } catch (err) {
            console.error(err);
            setIsGenerating(false);
        }
    };

    // 1. Loading State
    if (isInitializing || sessionStatus === "loading") {
        return (
            <div className="w-full max-w-md mx-auto p-12 mt-20 flex flex-col items-center justify-center bg-white/80 dark:bg-zinc-900/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-stone-200/50 dark:shadow-none border border-stone-200/60 dark:border-zinc-800/80 transition-colors duration-500 animate-in fade-in">
                <Loader2 className="animate-spin mb-6 text-orange-500" size={40} />
                <p className="text-[11px] font-black tracking-[0.2em] uppercase animate-pulse text-stone-500 dark:text-zinc-400">
                    Syncing Data...
                </p>
            </div>
        );
    }

    // 2. Name Entry State (Gatekeeper)
    if (!isJoined) {
        return (
            <div className="w-full max-w-md mx-auto p-8 mt-12 bg-white/80 dark:bg-zinc-900/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-stone-200/50 dark:shadow-none border border-stone-200/60 dark:border-zinc-800/80 transition-colors duration-500 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20 text-white dark:text-zinc-950 rotate-3">
                    <Users size={32} />
                </div>

                <h2 className="text-2xl font-black text-center mb-2 text-stone-900 dark:text-zinc-100 tracking-tight">
                    What's your Chef name?
                </h2>
                <p className="text-stone-500 dark:text-zinc-400 text-center mb-8 text-sm font-medium">
                    This name will show next to the ingredients you add.
                </p>

                <div className="space-y-4">
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && userName.trim() && setIsJoined(true)}
                        placeholder="e.g. Chef Oliver"
                        className={inputClasses}
                    />
                    <button
                        onClick={() => userName.trim() && setIsJoined(true)}
                        disabled={!userName.trim()}
                        className="w-full py-4 bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-2xl font-black text-lg hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white disabled:opacity-50 disabled:bg-stone-200 dark:disabled:bg-zinc-800 transition-all shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:shadow-none"
                    >
                        Enter Kitchen
                    </button>
                </div>
            </div>
        );
    }

    // 3. App Views Handlers
    if (view === "voting") {
        return <VotingStage roomId={roomId} initialRecipes={recipeOptions} voterId={currentVoterId} isHost={isHost} />;
    }

    if (view === "cooking" && winningRecipe) {
        return (
            <div className="animate-in fade-in duration-1000">
                <RecipeCard recipe={winningRecipe} />
            </div>
        );
    }

    // 4. Main Kitchen Lobby State
    return (
        <div className="max-w-xl mx-auto w-full pb-20 animate-in slide-in-from-bottom-4 duration-500">

            {/* Identity Badge */}
            <div className="flex justify-center mb-8">
                <div className="flex items-center gap-2 text-sm bg-white dark:bg-zinc-900/80 border border-stone-200 dark:border-zinc-800 px-5 py-2.5 rounded-full shadow-sm backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-stone-500 dark:text-zinc-400 font-medium">Cooking as</span>
                    <span className="text-stone-900 dark:text-zinc-100 font-bold">{userName}</span>
                </div>
            </div>

            {/* Rules / Constraints Telemetry */}
            {constraints && (
                <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border border-stone-200/80 dark:border-orange-500/20 rounded-[2rem] p-6 mb-8 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                        <Info size={16} className="text-orange-500" />
                        <h3 className="text-[10px] font-black text-stone-900 dark:text-zinc-300 uppercase tracking-widest">
                            Kitchen Rules
                        </h3>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-stone-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-stone-100 dark:border-zinc-800/50">
                            <Leaf size={16} className="text-green-500 mb-2" />
                            <p className="text-[9px] font-black text-stone-400 dark:text-zinc-500 uppercase tracking-widest">Diet</p>
                            <p className="text-xs font-bold text-stone-800 dark:text-zinc-200 mt-0.5 truncate">{constraints.dietary || "None"}</p>
                        </div>
                        <div className="bg-stone-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-stone-100 dark:border-zinc-800/50">
                            <ShieldAlert size={16} className="text-rose-500 mb-2" />
                            <p className="text-[9px] font-black text-stone-400 dark:text-zinc-500 uppercase tracking-widest">Allergy</p>
                            <p className="text-xs font-bold text-stone-800 dark:text-zinc-200 mt-0.5 truncate">{constraints.allergies || "None"}</p>
                        </div>
                        <div className="bg-stone-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-stone-100 dark:border-zinc-800/50">
                            <Clock size={16} className="text-blue-500 mb-2" />
                            <p className="text-[9px] font-black text-stone-400 dark:text-zinc-500 uppercase tracking-widest">Time</p>
                            <p className="text-xs font-bold text-stone-800 dark:text-zinc-200 mt-0.5 truncate">{constraints.timeLimit || "30"}m</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="flex gap-3 mb-10 group relative">
                <input
                    type="text"
                    value={input}
                    onKeyDown={(e) => e.key === "Enter" && addIngredient()}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Toss an ingredient in..."
                    className={`${inputClasses} flex-1 shadow-md dark:shadow-none`}
                />
                <button
                    onClick={addIngredient}
                    className="bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-950 px-6 rounded-2xl shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white transition-all flex items-center justify-center shrink-0"
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Ingredient Stream */}
            <div className="space-y-3 mb-12 min-h-[150px]">
                {ingredients.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-stone-400 dark:text-zinc-600 opacity-50 py-8">
                        <ChefHat size={32} className="mb-2" />
                        <p className="text-sm font-medium">The prep station is empty.</p>
                    </div>
                ) : (
                    ingredients.map((ing, idx) => (
                        <div
                            key={idx}
                            className="p-5 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-sm border border-stone-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm flex justify-between items-center animate-in slide-in-from-bottom-2 duration-300"
                        >
                            <span className="font-bold text-stone-800 dark:text-zinc-100 text-lg">
                                {ing.name}
                            </span>
                            <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 px-3 py-1.5 rounded-xl">
                                <ChefHat size={12} className="text-orange-500" />
                                <span className="text-[10px] uppercase tracking-widest text-orange-600 dark:text-orange-400 font-black">
                                    {ing.addedBy}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Generate Action Button */}
            <div className="sticky bottom-6 z-20">
                <button
                    onClick={generateRecipeOptions}
                    disabled={isGenerating || ingredients.length === 0}
                    className="w-full py-5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl font-black text-xl hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-50 disabled:from-stone-300 disabled:to-stone-400 dark:disabled:from-zinc-800 dark:disabled:to-zinc-800 disabled:text-stone-500 dark:disabled:text-zinc-600 transition-all shadow-xl shadow-orange-500/25 disabled:shadow-none flex items-center justify-center gap-3 border border-orange-400/50 dark:disabled:border-zinc-700/50"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="animate-spin" size={24} />
                            <span>AI is cooking...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={24} />
                            <span>Generate Recipe Options</span>
                        </>
                    )}
                </button>
            </div>

        </div>
    );
}