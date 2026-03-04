const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,

  // availability
  available: {
    type: Boolean,
    default: true,
  },

  // stock for instant items
  stock: {
    type: Number,
    default: 0, // used only for instant items
  },

  // preparation type
  preparationType: {
    type: String,
    enum: ["instant", "prepared"],
    required: true,
  },

  // only for prepared items
  prepTimePerBatch: Number, // in minutes (e.g. dosa = 5)
  batchCapacity: Number, // e.g. dosa = 4
});

module.exports = mongoose.model("MenuItem", menuItemSchema);

