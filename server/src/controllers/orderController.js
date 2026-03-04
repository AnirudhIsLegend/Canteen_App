const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const { emitToAll, emitToUser, emitToRoom } = require("../utils/socketManager");

// STUDENT: Place order


exports.placeOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const studentId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order items required" });
    }

    let totalAmount = 0;
    let orderItems = [];
    let orderEstimatedReadyTime = null;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);

      if (!menuItem || !menuItem.available) {
        return res
          .status(400)
          .json({ message: "Invalid or unavailable menu item" });
      }

      totalAmount += menuItem.price * item.quantity;

      if (menuItem.preparationType === "instant") {
        if (menuItem.stock < item.quantity) {
          return res
            .status(400)
            .json({ message: `${menuItem.name} is out of stock` });
        }

        menuItem.stock -= item.quantity;
        await menuItem.save();

        orderItems.push({
          menuItem: menuItem._id,
          quantity: item.quantity,
          preparationType: "instant",
          estimatedReadyTime: null,
        });
      }

      if (menuItem.preparationType === "prepared") {
        const existingOrders = await Order.find({
          status: { $in: ["pending", "preparing"] },
          "items.menuItem": menuItem._id,
        });

        let totalPendingQuantity = 0;

        existingOrders.forEach((order) => {
          order.items.forEach((i) => {
            if (i.menuItem.toString() === menuItem._id.toString()) {
              totalPendingQuantity += i.quantity;
            }
          });
        });

        // IMPORTANT: Include the current order quantity in the calculation
        const totalQuantityIncludingCurrent = totalPendingQuantity + item.quantity;

        // Calculate total batches needed (including current order)
        const totalBatches = Math.ceil(
          totalQuantityIncludingCurrent / menuItem.batchCapacity
        );

        // Calculate wait time in milliseconds
        const waitTimeMs =
          totalBatches * menuItem.prepTimePerBatch * 60 * 1000;

        const itemReadyTime = new Date(Date.now() + waitTimeMs);

        orderItems.push({
          menuItem: menuItem._id,
          quantity: item.quantity,
          preparationType: "prepared",
          estimatedReadyTime: itemReadyTime,
        });

        if (
          !orderEstimatedReadyTime ||
          itemReadyTime > orderEstimatedReadyTime
        ) {
          orderEstimatedReadyTime = itemReadyTime;
        }
      }
    }

    const order = await Order.create({
      student: studentId,
      items: orderItems,
      totalAmount,
      status: "pending",
      estimatedReadyTime: orderEstimatedReadyTime,
    });

    // Populate the order before emitting to ensure complete data
    const populatedOrder = await Order.findById(order._id)
      .populate("student", "usn username")
      .populate("items.menuItem", "name price");

    // ✅ Emit to admin-room for real-time admin dashboard updates
    emitToRoom("admin-room", "order:new", {
      orderId: populatedOrder._id,
      student: populatedOrder.student,
      items: populatedOrder.items,
      totalAmount: populatedOrder.totalAmount,
      status: populatedOrder.status,
      estimatedReadyTime: populatedOrder.estimatedReadyTime,
      createdAt: populatedOrder.createdAt,
    });

    console.log(`✅ New order ${order._id} created and emitted to admin-room`);

    res.status(201).json(populatedOrder);
  } catch (err) {
    console.error("❌ Error in placeOrder:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// STUDENT: View my orders
exports.getMyOrders = async (req, res) => {
  try {
    const studentId = req.user.id;

    const orders = await Order.find({ student: studentId })
      .populate("items.menuItem", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN: View all orders
exports.getAllOrders = async (req, res) => {
  try {
    console.log(`📋 Fetching all orders for admin user: ${req.user.id}`);

    const orders = await Order.find()
      .populate("student", "usn username")
      .populate("items.menuItem", "name price")
      .sort({ createdAt: -1 });

    console.log(`✅ Retrieved ${orders.length} orders`);
    res.json(orders);
  } catch (err) {
    console.error("❌ Error in getAllOrders:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ADMIN: Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "preparing", "ready"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Get the current order to check its status
    const currentOrder = await Order.findById(req.params.id);

    if (!currentOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Status transition validation - prevent backward transitions
    const statusHierarchy = { "pending": 1, "preparing": 2, "ready": 3 };
    const currentLevel = statusHierarchy[currentOrder.status];
    const newLevel = statusHierarchy[status];

    if (newLevel < currentLevel) {
      return res.status(400).json({
        message: `Cannot change order status from "${currentOrder.status}" back to "${status}". Orders can only progress forward.`
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("student", "usn username")
      .populate("items.menuItem", "name price");

    // ✅ Emit to specific student's room for real-time updates
    emitToUser(order.student._id.toString(), "order:statusUpdated", {
      orderId: order._id,
      status: order.status,
    });

    console.log(`✅ Order ${order._id} status updated to ${status}, emitted to student ${order.student._id}`);

    res.json(order);
  } catch (err) {
    console.error("❌ Error in updateOrderStatus:", err.message);
    res.status(500).json({ error: err.message });
  }
};

