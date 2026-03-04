require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initSocketServer } = require("./utils/socketManager");

const server = http.createServer(app);

// Initialize Socket.IO via socketManager
initSocketServer(server);

connectDB();

const PORT = process.env.PORT || 5050;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
