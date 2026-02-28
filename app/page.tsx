"use client";

import { useState } from "react";
import { UtensilsCrossed, Plus, LogIn, ChevronLeft } from "lucide-react";
import CreateRoom from "@/components/CreateRoom";
import JoinRoom from "@/components/JoinRoom";

export default function Home() {
  // Mode state controls which form is visible
  const [mode, setMode] = useState<"initial" | "create" | "join">("initial");

  return (
    <main className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">

        {/* 1. Shared Branding */}
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-orange-500 p-4 rounded-2xl shadow-lg">
            <UtensilsCrossed className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-stone-900 tracking-tight">ShareChef</h1>
          <p className="text-stone-500 italic">Version 1.1: Secured Kitchens</p>
        </div>

        {/* 2. Conditional View Logic */}
        <div className="mt-10">
          {mode === "initial" && (
            <div className="grid gap-4">
              {/* This button will eventually require a NextAuth session */}
              <button
                onClick={() => setMode("create")}
                className="flex items-center justify-center gap-2 bg-stone-900 text-white p-5 rounded-2xl font-semibold hover:bg-stone-800 transition-all shadow-md"
              >
                <Plus size={20} /> Host a Secured Room
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-stone-200"></div>
                <span className="flex-shrink mx-4 text-stone-400 text-sm font-medium">or</span>
                <div className="flex-grow border-t border-stone-200"></div>
              </div>

              <button
                onClick={() => setMode("join")}
                className="flex items-center justify-center gap-2 bg-white border-2 border-stone-100 text-stone-900 p-5 rounded-2xl font-semibold hover:border-orange-500 transition-all"
              >
                <LogIn size={20} className="text-orange-500" /> Join Existing Kitchen
              </button>
            </div>
          )}

          {/* Render the specialized components you created */}
          {mode === "create" && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <CreateRoom />
            </div>
          )}

          {mode === "join" && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <JoinRoom onJoinSuccess={(id) => window.location.href = `/room/${id}`} />
            </div>
          )}

          {/* 3. Back Navigation */}
          {mode !== "initial" && (
            <button
              onClick={() => setMode("initial")}
              className="mt-8 flex items-center justify-center gap-2 text-stone-400 hover:text-orange-500 transition-colors mx-auto text-sm font-bold uppercase tracking-wider"
            >
              <ChevronLeft size={16} /> Back to Menu
            </button>
          )}
        </div>
      </div>
    </main>
  );
}