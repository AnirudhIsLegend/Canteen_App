const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    usn: {
      type: String,
      unique: true,
      sparse: true, // allows admin without usn
    },
    username: {
      type: String,
      unique: true,
      sparse: true, // allows student without username
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "student"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
