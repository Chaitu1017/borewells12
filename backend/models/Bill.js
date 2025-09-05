const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  customerId: { type: String, required: true },
  feetDug: { type: Number, required: true },
  pipesUsed: { type: Number, required: true },
  pipeType: { type: String, enum: ['6-Gage', '4-Gage'], required: true },
  holesMade: { type: Number, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Bill", billSchema);