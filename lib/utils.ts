// lib/utils.ts
export function generateRoomId() {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
}