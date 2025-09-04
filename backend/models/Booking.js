const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  customerPhone: { type: String, required: true }, // ✅ Added phone field
  type: { type: String, enum: ["Agriculture", "House"], required: true },
  date: { type: Date, required: true },
  village: { type: String, required: true },
  town: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Cancelled"], default: "Pending" }, // ✅ Added "Completed" status
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);