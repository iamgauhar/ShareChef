"use client";

import { useState, useEffect } from "react";
import IngredientSection from "@/components/IngredientSection";
import JoinRoom from "@/components/JoinRoom";
import { useParams } from "next/navigation";

export default function RoomPage() {
    const params = useParams();
    const roomId = params.roomId as string;

    // This state tracks if the user has entered the correct password
    const [isAuthorized, setIsAuthorized] = useState(false);

    // If they aren't authorized yet, show the JoinRoom (Password) form
    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <JoinRoom
                        // We pass the roomId from the URL automatically
                        initialRoomId={roomId}
                        onJoinSuccess={() => setIsAuthorized(true)}
                    />
                </div>
            </div>
        );
    }

    // Only if authorized, show the actual app
    return (
        <div className="min-h-screen bg-[#FDFCFB] p-6">
            <div className="max-w-4xl mx-auto text-center mb-8">
                <h1 className="text-2xl font-bold text-stone-900">Kitchen Room</h1>
                <p className="text-stone-500">Room ID: <span className="font-mono font-bold text-orange-600 uppercase">{roomId}</span></p>
            </div>

            <IngredientSection roomId={roomId} />
        </div>
    );
}