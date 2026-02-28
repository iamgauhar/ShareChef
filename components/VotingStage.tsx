"use client";

import { useState, useEffect } from "react";
import { pusherClient } from "@/lib/pusher-client";
import { CheckCircle2, Circle, Trophy, Users } from "lucide-react";

interface VotingStageProps {
    roomId: string;
    initialRecipes: any[];
    voterId: string;
    isHost: boolean;
}

export default function VotingStage({ roomId, initialRecipes, voterId, isHost }: VotingStageProps) {
    const [recipes, setRecipes] = useState(initialRecipes);
    const [isVoting, setIsVoting] = useState(false);

    useEffect(() => {
        const channel = pusherClient.subscribe(`room-${roomId}`);

        channel.bind("vote-updated", (updatedRecipes: any[]) => {
            setRecipes(updatedRecipes);
        });

        return () => {
            channel.unbind("vote-updated");
        };
    }, [roomId]);

    const finalizeWinner = async () => {
        await fetch("/api/room/finalize", {
            method: "POST",
            body: JSON.stringify({ roomId }),
        });
    };


    const handleVote = async (index: number) => {
        if (isVoting) return;
        setIsVoting(true);

        // Optimistic UI Update: Instantly swap the vote on the screen before the DB finishes
        const optimisticRecipes = recipes.map((r, i) => {
            const currentVotes = Array.isArray(r.votes) ? r.votes : [];
            const clearedVotes = currentVotes.filter((id: string) => id !== voterId);

            return {
                ...r,
                votes: i === index ? [...clearedVotes, voterId] : clearedVotes
            };
        });
        setRecipes(optimisticRecipes);

        try {
            await fetch("/api/room/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roomId, recipeIndex: index, voterId }),
            });
        } catch (err) {
            console.error("Vote failed", err);
            // Revert to initial if failed (optional handling)
        } finally {
            setIsVoting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto w-full px-4 pb-20 mt-8 animate-in fade-in duration-500">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-stone-900 mb-2">Vote for the Best Recipe</h2>
                <p className="text-stone-500 text-sm">You can only vote for one. Change your mind anytime!</p>
            </div>

            <div className="space-y-4">
                {recipes.map((recipe, idx) => {
                    // Check if this specific user has voted for this recipe
                    const votesArray = Array.isArray(recipe.votes) ? recipe.votes : [];
                    const voteCount = votesArray.length;
                    const hasVotedForThis = votesArray.includes(voterId);

                    return (
                        <div
                            key={idx}
                            onClick={() => handleVote(idx)}
                            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-4
                                ${hasVotedForThis
                                    ? "bg-orange-50 border-orange-500 shadow-md shadow-orange-100"
                                    : "bg-white border-stone-100 hover:border-orange-200 hover:shadow-sm"
                                }`}
                        >
                            {/* Selection Indicator */}
                            <div className={`shrink-0 ${hasVotedForThis ? "text-orange-500" : "text-stone-300"}`}>
                                {hasVotedForThis ? <CheckCircle2 size={28} className="fill-orange-100" /> : <Circle size={28} />}
                            </div>

                            {/* Recipe Details */}
                            <div className="flex-1">
                                <h3 className={`font-bold text-lg ${hasVotedForThis ? "text-orange-900" : "text-stone-800"}`}>
                                    {recipe.title}
                                </h3>
                                <p className="text-sm text-stone-500 line-clamp-2 mt-1">{recipe.description}</p>
                            </div>

                            {/* Vote Counter Badge */}
                            <div className="shrink-0 flex items-center gap-1.5 bg-white border border-stone-100 px-3 py-1.5 rounded-xl shadow-sm">
                                <Users size={14} className={voteCount > 0 ? "text-orange-500" : "text-stone-400"} />
                                <span className={`font-black text-sm ${voteCount > 0 ? "text-stone-800" : "text-stone-400"}`}>
                                    {voteCount}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
            {isHost && <button
                onClick={finalizeWinner}
                className="w-full mt-10 py-5 bg-stone-900 text-white rounded-2xl font-black text-xl hover:bg-green-600 transition-all shadow-2xl flex items-center justify-center gap-3"
            >
                <Trophy size={24} />
                <span>Finalize Winner & Start Cooking!</span>
            </button>}
        </div>
    );
}