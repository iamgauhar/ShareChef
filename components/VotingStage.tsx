"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, Trophy } from "lucide-react";
import { pusherClient } from "@/lib/pusher-client";

interface Recipe {
    title: string;
    description: string;
    votes: number;
    prepTime: string;
}

export default function VotingStage({ roomId, initialRecipes }: { roomId: string, initialRecipes: Recipe[] }) {
    const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);

    // Inside VotingStage.tsx
    useEffect(() => {
        const channel = pusherClient.subscribe(`room-${roomId}`);

        // Create a named function so we can cleanly unbind it later
        const handleVoteUpdate = (updatedRecipes: Recipe[]) => {
            setRecipes(updatedRecipes);
        };

        channel.bind("vote-updated", handleVoteUpdate);

        return () => {
            // ONLY unbind this specific event. 
            // DO NOT call unsubscribe() here, because the parent still needs the channel!
            channel.unbind("vote-updated", handleVoteUpdate);
        };
    }, [roomId]);

    const handleVote = async (recipeTitle: string) => {
        await fetch("/api/room/vote", {
            method: "POST",
            body: JSON.stringify({ roomId, recipeTitle }),
        });
    };

    // Sort recipes: Highest votes first
    const sortedRecipes = [...recipes].sort((a, b) => b.votes - a.votes);

    const finalizeWinner = async () => {
        await fetch("/api/room/finalize", {
            method: "POST",
            body: JSON.stringify({ roomId }),
        });
    };

    if (!Array.isArray(recipes) || recipes.length === 0) {
        return <div className="text-center mt-10">Waiting for recipes to load...</div>;
    }

    return (
        <div className="mt-10 max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 font-serif">Vote for the Best Recipe!</h2>

            <div className="grid gap-6">
                {sortedRecipes.map((recipe, index) => (
                    <div
                        key={recipe.title}
                        className={`relative p-6 rounded-3xl border-2 transition-all duration-500 ${index === 0
                            ? "border-orange-500 bg-orange-50 scale-105 shadow-xl"
                            : "border-stone-100 bg-white opacity-80"
                            }`}
                    >
                        {index === 0 && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                                <Trophy size={14} /> Leading
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-stone-900">{recipe.title}</h3>
                                <p className="text-stone-600 mt-1">{recipe.description}</p>
                                <span className="text-sm text-stone-400 mt-2 block italic">{recipe.prepTime}</span>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <span className="text-2xl font-black text-orange-600">{recipe.votes}</span>
                                <button
                                    onClick={() => handleVote(recipe.title)}
                                    className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-2xl shadow-lg active:scale-90 transition-transform"
                                >
                                    <ThumbsUp size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={finalizeWinner}
                className="w-full mt-10 py-5 bg-stone-900 text-white rounded-2xl font-black text-xl hover:bg-green-600 transition-all shadow-2xl flex items-center justify-center gap-3"
            >
                <Trophy size={24} />
                <span>Finalize Winner & Start Cooking!</span>
            </button>

        </div>
    );
}