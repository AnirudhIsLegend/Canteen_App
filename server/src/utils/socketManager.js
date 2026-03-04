const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io = null;

/**
 * Initialize Socket.IO server
 * @param {http.Server} httpServer - HTTP server instance
 */
function initSocketServer(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // In production, specify exact origin
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    // Handle user joining their personal room
    socket.on("join", (data) => {
      try {
        const { userId, token, role } = data || {};

        // Optional: Verify token for added security
        if (token) {
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const roomId = decoded.id;
            const userRole = decoded.role;

            socket.join(roomId);
            console.log(`✅ User ${roomId} joined room ${roomId}`);

            // If admin, also join the admin-room for broadcasts
            if (userRole === "admin" || role === "admin") {
              socket.join("admin-room");
              console.log(`✅ Admin ${roomId} joined admin-room`);
            }
          } catch (err) {
            console.error("❌ Invalid token on socket join:", err.message);
          }
        } else if (userId) {
          // Fallback: Join by userId if no token provided
          socket.join(userId);
          console.log(`✅ User ${userId} joined room ${userId}`);

          // If role is provided and it's admin, join admin-room
          if (role === "admin") {
            socket.join("admin-room");
            console.log(`✅ Admin ${userId} joined admin-room`);
          }
        }
      } catch (err) {
        console.error("❌ Error in socket join handler:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });

    socket.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });
  });

  console.log("✅ Socket.IO server initialized");
  return io;
}

/**
 * Get the Socket.IO instance
 * @returns {Server} Socket.IO instance
 */
function getIO() {
  if (!io) {
    throw new Error("Socket.IO not initialized. Call initSocketServer first.");
  }
  return io;
}

/**
 * Emit event to a specific user's room
 * @param {string} userId - User ID
 * @param {string} event - Event name
 * @param {object} data - Event data
 */
function emitToUser(userId, event, data) {
  try {
    if (!io) {
      console.warn("⚠️ Socket.IO not initialized, cannot emit to user");
      return;
    }
    io.to(userId.toString()).emit(event, data);
    console.log(`📤 Emitted '${event}' to user ${userId}`);
  } catch (err) {
    console.error(`❌ Error emitting to user ${userId}:`, err.message);
  }
}

/**
 * Emit event to all connected clients
 * @param {string} event - Event name
 * @param {object} data - Event data
 */
function emitToAll(event, data) {
  try {
    if (!io) {
      console.warn("⚠️ Socket.IO not initialized, cannot emit to all");
      return;
    }
    io.emit(event, data);
    console.log(`📤 Emitted '${event}' to all clients`);
  } catch (err) {
    console.error(`❌ Error emitting to all:`, err.message);
  }
}

/**
 * Emit event to a specific room
 * @param {string} room - Room name
 * @param {string} event - Event name
 * @param {object} data - Event data
 */
function emitToRoom(room, event, data) {
  try {
    if (!io) {
      console.warn("⚠️ Socket.IO not initialized, cannot emit to room");
      return;
    }
    io.to(room).emit(event, data);
    console.log(`📤 Emitted '${event}' to room '${room}'`);
  } catch (err) {
    console.error(`❌ Error emitting to room ${room}:`, err.message);
  }
}

module.exports = {
  initSocketServer,
  getIO,
  emitToUser,
  emitToAll,
  emitToRoom,
};
