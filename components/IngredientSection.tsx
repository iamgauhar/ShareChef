"use client";

import { useEffect, useState } from "react";
import { Send, Sparkles, Plus, Users, Lock, ShieldAlert, Clock, Leaf, Info, Loader2 } from "lucide-react";
import { pusherClient } from "@/lib/pusher-client";
import RecipeCard from "./RecipeCard";
import VotingStage from "./VotingStage";

export default function IngredientSection({ roomId }: { roomId: string }) {
    const [userName, setUserName] = useState("");
    const [isJoined, setIsJoined] = useState(false);
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [view, setView] = useState<"lobby" | "voting" | "cooking">("lobby");
    const [recipeOptions, setRecipeOptions] = useState<any[]>([]);
    const [winningRecipe, setWinningRecipe] = useState<any>(null);

    // NEW: State for Kitchen Rules (Constraints)
    const [constraints, setConstraints] = useState<any>(null);

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

    // Enhanced Sync: Fetching status AND constraints
    useEffect(() => {
        const syncRoomState = async () => {
            const res = await fetch(`/api/room/status?roomId=${roomId}`, {
                cache: "no-store"
            });
            const data = await res.json();
            console.log(data)
            // Set constraints for the Kitchen Rules banner
            if (data.constraints) {
                setConstraints(data.constraints);
            }

            if (data.status === "voting" && data.recipes) {
                setRecipeOptions(data.recipes);
                setView("voting");
            } else if (data.status === "completed" && data.winner) {
                setWinningRecipe(data.winner);
                setView("cooking");
            }
        };

        if (isJoined) syncRoomState();
    }, [roomId, isJoined]);

    console.log("CTRNSSSS", constraints)

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

    if (!isJoined) {
        return (
            <div className="mt-20 max-w-md mx-auto p-8 bg-white rounded-3xl shadow-xl border border-stone-100 text-center">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2">What's your Chef name?</h2>
                <p className="text-stone-500 mb-6 text-sm">This name will show next to the ingredients you add.</p>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full p-4 border-2 border-stone-100 rounded-2xl mb-4 outline-none focus:border-orange-500"
                />
                <button
                    onClick={() => userName.trim() && setIsJoined(true)}
                    className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all"
                >
                    Enter Kitchen
                </button>
            </div>
        );
    }

    if (view === "voting") {
        return <VotingStage roomId={roomId} initialRecipes={recipeOptions} />;
    }

    if (view === "cooking" && winningRecipe) {
        return (
            <div className="animate-in fade-in duration-1000">
                <RecipeCard recipe={winningRecipe} />
            </div>
        );
    }

    return (
        <div className="mt-8 max-w-lg mx-auto w-full px-4 pb-20">
            {/* Header showing current user */}
            <div className="flex items-center gap-2 mb-6 text-stone-400 text-sm bg-stone-50 w-fit px-4 py-2 rounded-full mx-auto font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Cooking as <span className="text-stone-800 font-bold">{userName}</span>
            </div>

            {/* NEW: Kitchen Rules Banner */}
            {constraints && (
                <div className="bg-orange-50/50 border border-orange-100 rounded-3xl p-5 mb-8 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2 mb-4">
                        <Info size={16} className="text-orange-600" />
                        <h3 className="text-[10px] font-black text-stone-900 uppercase tracking-widest">Kitchen Rules</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-orange-100/50">
                            <Leaf size={14} className="text-green-500 mb-1" />
                            <p className="text-[8px] font-black text-stone-400 uppercase tracking-tighter">Diet</p>
                            <p className="text-[11px] font-bold text-stone-700 truncate">{constraints.dietary || "None"}</p>
                        </div>

                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-orange-100/50">
                            <ShieldAlert size={14} className="text-red-500 mb-1" />
                            <p className="text-[8px] font-black text-stone-400 uppercase tracking-tighter">Allergy</p>
                            <p className="text-[11px] font-bold text-stone-700 truncate">{constraints.allergies || "None"}</p>
                        </div>

                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-orange-100/50">
                            <Clock size={14} className="text-blue-500 mb-1" />
                            <p className="text-[8px] font-black text-stone-400 uppercase tracking-tighter">Time</p>
                            <p className="text-[11px] font-bold text-stone-700 truncate">{constraints.timeLimit || "30"}m</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-2 mb-8 group">
                <input
                    type="text"
                    value={input}
                    onKeyDown={(e) => e.key === "Enter" && addIngredient()}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add an ingredient..."
                    className="flex-1 p-4 bg-white border-2 border-stone-100 rounded-2xl focus:border-orange-500 outline-none shadow-sm"
                />
                <button onClick={addIngredient} className="bg-orange-500 text-white p-4 rounded-2xl shadow-lg active:scale-95">
                    <Plus size={24} />
                </button>
            </div>

            <div className="space-y-3 mb-8">
                {ingredients.map((ing, idx) => (
                    <div key={idx} className="p-4 bg-white border border-stone-100 rounded-2xl shadow-sm flex justify-between items-center animate-in zoom-in-95 duration-300">
                        <span className="font-semibold text-stone-800">{ing.name}</span>
                        <span className="text-[10px] uppercase tracking-widest text-orange-500 font-black bg-orange-50 px-3 py-1 rounded-lg">
                            Chef {ing.addedBy}
                        </span>
                    </div>
                ))}
            </div>

            <button
                onClick={generateRecipeOptions}
                disabled={isGenerating || ingredients.length === 0}
                className="w-full py-5 bg-stone-900 text-white rounded-2xl font-black text-lg hover:bg-orange-600 disabled:bg-stone-200 transition-all shadow-xl flex items-center justify-center gap-3"
            >
                {isGenerating ? (
                    <><Loader2 className="animate-spin" /> Llama is creating options...</>
                ) : (
                    <><Sparkles size={20} /> Create 3 Recipes to Vote ✨</>
                )}
            </button>
        </div>
    );
}