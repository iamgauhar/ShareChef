"use client";

import { useState, useEffect } from "react";
import { pusherClient } from "@/lib/pusher-client";
import { CheckCircle2, Circle, Trophy, Users, BarChart3 } from "lucide-react";

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
        <div className="max-w-2xl mx-auto w-full px-4 pb-24 mt-8 animate-in slide-in-from-bottom-8 fade-in duration-700">

            {/* Header Area */}
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20 text-white dark:text-zinc-950 rotate-3">
                    <BarChart3 size={32} />
                </div>
                <h2 className="text-3xl font-black text-stone-900 dark:text-zinc-100 tracking-tight mb-3">
                    Vote for the Best Recipe
                </h2>
                <div className="inline-flex items-center gap-2 bg-stone-100 dark:bg-zinc-900/80 border border-stone-200 dark:border-zinc-800 px-4 py-2 rounded-full shadow-sm backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    <p className="text-stone-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest">
                        Live Polling Active
                    </p>
                </div>
            </div>

            {/* Voting Cards */}
            <div className="space-y-5">
                {recipes.map((recipe, idx) => {
                    // Check if this specific user has voted for this recipe
                    const votesArray = Array.isArray(recipe.votes) ? recipe.votes : [];
                    const voteCount = votesArray.length;
                    const hasVotedForThis = votesArray.includes(voterId);

                    return (
                        <div
                            key={idx}
                            onClick={() => handleVote(idx)}
                            className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 flex items-center gap-5 relative overflow-hidden group
                                ${hasVotedForThis
                                    ? "bg-orange-50/80 dark:bg-orange-500/10 border-orange-500 shadow-xl shadow-orange-500/20 scale-[1.02]"
                                    : "bg-white/80 dark:bg-zinc-900/60 border-stone-200/80 dark:border-zinc-800/80 hover:border-orange-400/50 dark:hover:border-orange-500/50 backdrop-blur-md hover:scale-[1.01]"
                                }`}
                        >
                            {/* Subtle background glow for selected card */}
                            {hasVotedForThis && (
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent pointer-events-none" />
                            )}

                            {/* Selection Indicator */}
                            <div className={`shrink-0 transition-colors duration-300 z-10 ${hasVotedForThis ? "text-orange-500" : "text-stone-300 dark:text-zinc-600 group-hover:text-orange-400/50"}`}>
                                {hasVotedForThis ? (
                                    <CheckCircle2 size={32} className="fill-orange-100 dark:fill-orange-950" />
                                ) : (
                                    <Circle size={32} />
                                )}
                            </div>

                            {/* Recipe Details */}
                            <div className="flex-1 z-10">
                                <h3 className={`font-black text-xl tracking-tight mb-1 transition-colors duration-300 ${hasVotedForThis ? "text-stone-900 dark:text-zinc-100" : "text-stone-800 dark:text-zinc-200 group-hover:text-stone-900 dark:group-hover:text-zinc-100"}`}>
                                    {recipe.title}
                                </h3>
                                <p className="text-sm text-stone-500 dark:text-zinc-400 line-clamp-2 font-medium">
                                    {recipe.description}
                                </p>
                            </div>

                            {/* Vote Counter Badge */}
                            <div className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-colors duration-300 z-10
                                ${hasVotedForThis
                                    ? "bg-white dark:bg-zinc-950 border-orange-200 dark:border-orange-500/30 shadow-inner"
                                    : "bg-stone-50 dark:bg-zinc-950/50 border-stone-100 dark:border-zinc-800/50 shadow-inner"}`}
                            >
                                <Users size={16} className={voteCount > 0 ? "text-orange-500" : "text-stone-400 dark:text-zinc-600"} />
                                <span className={`font-black text-lg leading-none ${voteCount > 0 ? "text-stone-900 dark:text-zinc-100" : "text-stone-400 dark:text-zinc-600"}`}>
                                    {voteCount}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Host Finalize Action */}
            {isHost && (
                <button
                    onClick={finalizeWinner}
                    className="w-full mt-12 py-5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl font-black text-xl hover:scale-[1.02] transition-all shadow-xl shadow-green-500/25 flex items-center justify-center gap-3 border border-green-400/50 animate-in slide-in-from-bottom-4 duration-500 delay-300"
                >
                    <Trophy size={24} className="animate-bounce" />
                    <span>Finalize Winner & Start Cooking!</span>
                </button>
            )}
        </div>
    );
}