const Admin = require("../models/Admin");
const Booking = require("../models/Booking");
const Bill = require("../models/Bill"); // ✅ Added Bill model

// Signup
exports.adminSignup = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // check if phone already exists
    const existing = await Admin.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: "Phone number already registered" });
    }
    // generate unique adminId
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
    res.status(200).json({ message: "Login successful", adminId: admin.adminId });
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

// ✅ NEW: Get bookings filtered by type
exports.getBookingsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const bookings = await Booking.find({ type }).populate("customerId", "name phone").sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Admin get bookings by type error:", error);
    res.status(500).json({ message: "Failed to fetch bookings by type", error: error.message });
  }
};

// ✅ NEW: Update booking status
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

// ✅ NEW: Send bill for a completed booking
exports.sendBill = async (req, res) => {
  try {
    const { bookingId, customerId, amount, description } = req.body;
    const newBill = new Bill({ bookingId, customerId, amount, description });
    await newBill.save();
    
    // Update booking status to "Completed"
    await Booking.findByIdAndUpdate(bookingId, { status: "Completed" });

    res.status(201).json({ message: "Bill sent successfully", bill: newBill });
  } catch (error) {
    console.error("Error sending bill:", error);
    res.status(500).json({ message: "Failed to send bill", error: error.message });
  }
};