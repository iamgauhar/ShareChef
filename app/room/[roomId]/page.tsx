// app/room/[roomId]/page.tsx
import IngredientSection from "@/components/IngredientSection";
export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
    // We await params to get the actual roomId
    const { roomId } = await params;


    // Inside your RoomPage component:
    return (
        <div className="p-10 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-stone-900">ShareChef Room</h1>
            <p className="text-stone-500">Room ID: <span className="font-mono font-bold text-orange-600 uppercase">{roomId}</span></p>

            <IngredientSection roomId={roomId} />
        </div>
    );
}