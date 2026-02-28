import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    owner: { type: String, required: true },
    status: { type: String, default: "lobby" },
    constraints: {
        dietary: { type: String, default: "None" },
        allergies: { type: String, default: "None" },
        timeLimit: { type: String, default: "30 mins" }
    },
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