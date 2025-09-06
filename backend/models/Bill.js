const mongoose = require("mongoose");

const billItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  feet: { type: Number, default: 0 },
  rate: { type: Number, default: 0 },
  amount: { type: Number, required: true }
});

const billSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  customerId: { type: String, required: true },
  items: [billItemSchema], // Array of billing items
  totalAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["Pending", "Paid"], default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Bill", billSchema);