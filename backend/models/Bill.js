const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  customerId: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["Pending", "Paid"], default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Bill", billSchema);