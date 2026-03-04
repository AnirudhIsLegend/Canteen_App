const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenu,
} = require("../controllers/menuController");

// Student & Admin can view menu
router.get("/", authMiddleware, getMenu);

// Admin-only routes
router.post("/", authMiddleware, roleMiddleware("admin"), addMenuItem);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateMenuItem);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteMenuItem);

module.exports = router;
