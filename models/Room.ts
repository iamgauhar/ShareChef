import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    password: { type: String, default: "" },
    status: { type: String, default: "lobby" },
    ingredients: [
        {
            name: String,
            addedBy: String,
            timestamp: { type: Date, default: Date.now }
        }
    ],
    recipes: { type: Array, default: [] }, // Defined as a generic array for maximum compatibility
    winner: { type: Object, default: null }
}, {
    timestamps: true,
    strict: false // This allows MongoDB to save fields even if they aren't perfectly defined
});

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);