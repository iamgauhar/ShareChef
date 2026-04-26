"use client";

import { CheckCircle2, Clock, Printer, Utensils, Sparkles } from "lucide-react";

interface RecipeProps {
    recipe: {
        title: string;
        description: string;
        steps: string[];
        prepTime: string;
    };
}

export default function RecipeCard({ recipe }: RecipeProps) {
    return (
        <div className="mt-10 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-xl border border-stone-200/80 dark:border-zinc-800/80 rounded-[2.5rem] shadow-2xl dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-1000 max-w-3xl mx-auto transition-colors duration-500">

            {/* Header Section */}
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-rose-600 p-8 md:p-10 text-white relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-white/10 blur-3xl rounded-full pointer-events-none rotate-12" />

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-sm">
                            <Utensils size={14} className="text-orange-100" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                                Llama 3.3 Original
                            </span>
                        </div>
                        <button
                            onClick={() => window.print()}
                            className="p-2.5 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/30 transition-all border border-white/20 hover:scale-105 active:scale-95 shadow-sm"
                            title="Print Recipe"
                        >
                            <Printer size={18} />
                        </button>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-[1.1] text-white drop-shadow-sm">
                        {recipe.title}
                    </h2>

                    <div className="flex items-center gap-2 text-orange-100 bg-black/10 w-fit px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                        <Clock size={16} />
                        <span className="text-sm font-bold tracking-wide">{recipe.prepTime}</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-10 space-y-10">

                {/* Inspiration / AI Description */}
                <div className="relative">
                    <Sparkles className="absolute -top-3 -left-3 text-orange-200 dark:text-zinc-700/50 opacity-50" size={40} />
                    <h3 className="text-[10px] font-black text-stone-400 dark:text-zinc-500 uppercase tracking-widest mb-3 relative z-10">
                        The Inspiration
                    </h3>
                    <p className="text-xl md:text-2xl text-stone-700 dark:text-zinc-300 leading-relaxed font-serif italic text-balance relative z-10">
                        "{recipe.description}"
                    </p>
                </div>

                <div className="h-px w-full bg-stone-100 dark:bg-zinc-800/80" />

                {/* Preparation Steps */}
                <div>
                    <h3 className="text-[10px] font-black text-stone-400 dark:text-zinc-500 uppercase tracking-widest mb-5">
                        Preparation Steps
                    </h3>
                    <div className="grid gap-4">
                        {recipe.steps.map((step, index) => (
                            <div
                                key={index}
                                className="group flex gap-5 p-5 md:p-6 rounded-[1.5rem] bg-stone-50 dark:bg-zinc-950/50 border border-stone-100 dark:border-zinc-800/80 hover:border-orange-400/50 dark:hover:border-orange-500/50 transition-all hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(249,115,22,0.1)] duration-300"
                            >
                                <div className="shrink-0 flex items-start">
                                    <span className="w-10 h-10 bg-white dark:bg-zinc-900 text-orange-500 dark:text-orange-400 rounded-xl shadow-sm flex items-center justify-center font-black text-lg border border-stone-200 dark:border-zinc-700 group-hover:bg-orange-500 group-hover:text-white dark:group-hover:bg-orange-500 dark:group-hover:text-zinc-950 dark:group-hover:border-orange-400 transition-colors duration-300">
                                        {index + 1}
                                    </span>
                                </div>
                                <p className="text-stone-700 dark:text-zinc-300 text-lg leading-relaxed font-medium pt-1.5">
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Validation */}
                <div className="pt-8 flex flex-col items-center gap-4 text-center">
                    <div className="flex items-center gap-2 px-5 py-2.5 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 rounded-full">
                        <CheckCircle2 size={18} className="text-green-500 dark:text-green-400" />
                        <span className="text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-widest">
                            Recipe Validated by Groq AI
                        </span>
                    </div>
                    <p className="text-stone-400 dark:text-zinc-500 text-sm font-medium">
                        Bon appétit! Share this room ID with friends to cook together again.
                    </p>
                </div>
            </div>
        </div>
    );
}