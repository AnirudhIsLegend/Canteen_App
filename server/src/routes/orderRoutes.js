const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus } =
  require("../controllers/orderController");

// STUDENT: Place order
router.post(
  "/",
  authMiddleware,
  roleMiddleware("student"),
  placeOrder
);

// STUDENT: View my orders
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("student"),
  getMyOrders
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    getAllOrders
  );
// ADMIN: Update order status
router.put(
    "/:id/status",
    authMiddleware,
    roleMiddleware("admin"),
    updateOrderStatus
  );
  


module.exports = router;
