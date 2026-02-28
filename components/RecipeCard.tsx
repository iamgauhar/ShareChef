"use client";

import { CheckCircle2, Clock, Printer, Utensils } from "lucide-react";

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
        <div className="mt-10 bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-700 max-w-2xl mx-auto">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 text-white">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 mb-2 bg-white/20 px-3 py-1 rounded-full w-fit">
                        <Utensils size={14} />
                        <span className="text-xs font-bold uppercase tracking-wider">Llama Chef Original</span>
                    </div>
                    <button onClick={() => window.print()} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                        <Printer size={20} />
                    </button>
                </div>

                <h2 className="text-4xl font-bold font-serif mb-4 leading-tight">{recipe.title}</h2>

                <div className="flex items-center gap-2 text-orange-100">
                    <Clock size={18} />
                    <span className="font-semibold">{recipe.prepTime}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 space-y-8">
                <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] text-stone-400 font-black mb-3">The Inspiration</h3>
                    <p className="text-xl text-stone-700 leading-relaxed font-serif italic text-balance">
                        "{recipe.description}"
                    </p>
                </div>

                <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] text-stone-400 font-black mb-5">Preparation Steps</h3>
                    <div className="grid gap-4">
                        {recipe.steps.map((step, index) => (
                            <div key={index} className="group flex gap-5 p-5 rounded-2xl bg-stone-50 border border-stone-100 hover:border-orange-200 transition-all hover:shadow-md">
                                <span className="flex-shrink-0 w-10 h-10 bg-white text-orange-600 rounded-xl shadow-sm flex items-center justify-center font-bold text-lg border border-stone-100 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                    {index + 1}
                                </span>
                                <p className="text-stone-700 text-lg leading-snug self-center">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-8 border-t border-stone-100 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-green-600 font-bold px-4 py-2 bg-green-50 rounded-full">
                        <CheckCircle2 size={20} />
                        <span>Recipe Validated by ShareChef AI</span>
                    </div>
                    <p className="text-stone-400 text-sm italic">Share this room ID with friends to cook together!</p>
                </div>
            </div>
        </div>
    );
}