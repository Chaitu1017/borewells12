const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  adminId: { type: String, unique: true, required: true },  // unique ID
  name: { type: String, required: true },
  phone: { type: String, unique: true, required: true },    // phone instead of email
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);
