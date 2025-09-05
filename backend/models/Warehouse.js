const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({
  item: { type: String, enum: ["4-Gage", "6-Gage"], required: true, unique: true },
  quantity: { type: Number, required: true, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Warehouse", warehouseSchema);