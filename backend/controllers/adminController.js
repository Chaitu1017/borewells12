const Admin = require("../models/Admin");
const Booking = require("../models/Booking");
const Bill = require("../models/Bill");
const Customer = require("../models/Customer");
const Warehouse = require("../models/Warehouse"); // ✅ NEW: Import Warehouse model

// ⚠️ IMPORTANT: This is the secret key required for admin signup.
// Change this to a secure, private key.
const ADMIN_SECRET_KEY = "my_secret_key_123";

// Signup
exports.adminSignup = async (req, res) => {
  try {
    const { name, phone, password, secretKey } = req.body;
    if (!name || !phone || !password || !secretKey) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // ✅ NEW: Check for the secret key
    if (secretKey !== ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: "Invalid secret key" });
    }
    const existing = await Admin.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: "Phone number already registered" });
    }
    const adminId = "ADM" + Date.now();
    const newAdmin = new Admin({ adminId, name, phone, password });
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully", adminId });
  } catch (error) {
    console.error("Admin signup error:", error);
    res.status(500).json({ message: "Admin signup failed", error: error.message });
  }
};

// Login
exports.adminLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const admin = await Admin.findOne({ phone });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    if (admin.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // ✅ UPDATED: Return the admin's name as well
    res.status(200).json({ message: "Login successful", adminId: admin.adminId, name: admin.name });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Get all booking requests for Admin (now includes customer details)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("customerId", "name phone");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Admin get bookings error:", error);
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};

// Get bookings filtered by type
exports.getBookingsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const bookings = await Booking.find({ type }).populate("customerId", "name phone").sort({ status: 1, createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Admin get bookings by type error:", error);
    res.status(500).json({ message: "Failed to fetch bookings by type", error: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking status updated successfully", booking });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ message: "Failed to update booking status", error: error.message });
  }
};

// Send bill for a completed booking
exports.sendBill = async (req, res) => {
  try {
    const { bookingId, feetDug, pipesUsed, pipeType, holesMade, amount } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const existingBill = await Bill.findOne({ bookingId });
    if (existingBill) {
      return res.status(409).json({ message: "A bill for this booking has already been sent." });
    }
    const newBill = new Bill({
      bookingId,
      customerId: booking.customerId,
      feetDug,
      pipesUsed,
      pipeType,
      holesMade,
      amount
    });
    await newBill.save();
    booking.status = "Completed";
    await booking.save();

    // ✅ NEW: Decrease warehouse stock
    await Warehouse.findOneAndUpdate(
      { item: pipeType },
      { $inc: { quantity: -pipesUsed } },
      { new: true, upsert: true }
    );

    res.status(201).json({ message: "Bill sent successfully", bill: newBill });
  } catch (error) {
    console.error("Error sending bill:", error);
    res.status(500).json({ message: "Failed to send bill", error: error.message });
  }
};

// Get warehouse summary
exports.getWarehouseSummary = async (req, res) => {
  try {
    const pipes = await Warehouse.find();
    const pipesUsed = await Bill.aggregate([
      { $group: { _id: null, total: { $sum: "$pipesUsed" } } }
    ]);
    const totalPipesUsed = pipesUsed.length > 0 ? pipesUsed[0].total : 0;
    const totalPipesInStock = pipes.reduce((sum, pipe) => sum + pipe.quantity, 0);

    res.status(200).json({
      pipes,
      totalPipesInStock,
      totalPipesUsed
    });
  } catch (error) {
    console.error("Error fetching warehouse summary:", error);
    res.status(500).json({ message: "Failed to fetch warehouse summary", error: error.message });
  }
};

// ✅ NEW: Add stock to warehouse
exports.addStock = async (req, res) => {
  try {
    const { item, quantity } = req.body;
    if (!item || !quantity) {
      return res.status(400).json({ message: "Item and quantity are required" });
    }
    const warehouseItem = await Warehouse.findOneAndUpdate(
      { item },
      { $inc: { quantity: quantity } },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "Stock updated successfully", warehouseItem });
  } catch (error) {
    console.error("Error adding stock:", error);
    res.status(500).json({ message: "Failed to add stock", error: error.message });
  }
};