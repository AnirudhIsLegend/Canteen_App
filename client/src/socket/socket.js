import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5050";

const socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
});

// Handle connection
socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);

    // Join user-specific room on connection
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    if (token && userId) {
        socket.emit("join", { userId, token, role });
        console.log(`📍 Joining room for user: ${userId} (${role})`);
    }
});

socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
});

socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error.message);
});

export default socket;
