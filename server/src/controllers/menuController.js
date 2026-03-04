const MenuItem = require("../models/MenuItem");

// ADMIN: Add menu item
exports.addMenuItem = async (req, res) => {
  try {
    const {
      name,
      price,
      available,
      preparationType,
      stock,
      prepTimePerBatch,
      batchCapacity
    } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    if (!preparationType || !["instant", "prepared"].includes(preparationType)) {
      return res.status(400).json({ message: "Valid preparation type is required (instant or prepared)" });
    }

    const itemData = {
      name,
      price,
      available: available !== undefined ? available : true,
      preparationType,
    };

    // Add type-specific fields
    if (preparationType === "instant") {
      itemData.stock = stock || 0;
    } else if (preparationType === "prepared") {
      itemData.prepTimePerBatch = prepTimePerBatch || 0;
      itemData.batchCapacity = batchCapacity || 0;
    }

    const item = await MenuItem.create(itemData);

    res.status(201).json(item);
  } catch (err) {
    console.error("Error adding menu item:", err);
    res.status(500).json({ error: err.message });
  }
};

// ADMIN: Update menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN: Delete menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({ message: "Menu item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// STUDENT: View menu
exports.getMenu = async (req, res) => {
  try {
    const menu = await MenuItem.find();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
