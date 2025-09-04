const Customer = require("../models/Customer");
const Booking = require("../models/Booking");
const Bill = require("../models/Bill"); // ✅ Added Bill model
const bcrypt = require("bcrypt");

// ------------------ SIGNUP ------------------
exports.customerSignup = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await Customer.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: "Phone number already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const customerId = "CUST" + Date.now();
    const newCustomer = new Customer({ customerId, name, phone, password: hashedPassword });
    await newCustomer.save();
    return res.status(201).json({
      message: "Customer registered successfully",
      customerId
    });
  } catch (error) {
    console.error("Customer signup error:", error);
    return res.status(500).json({
      message: "Customer signup failed",
      error: error.message
    });
  }
};

// ------------------ LOGIN ------------------
exports.customerLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const customer = await Customer.findOne({ phone });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    return res.status(200).json({
      message: "Login successful",
      customerId: customer.customerId,
      name: customer.name,
      phone: customer.phone
    });
  } catch (error) {
    console.error("Customer login error:", error);
    return res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
};

// ------------------ BOOK BORE ------------------
exports.bookBore = async (req, res) => {
  try {
    const { customerId, type, date, village, town } = req.body;
    if (!customerId || !type || !date || !village || !town) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ✅ Get customer's phone number from the database
    const customer = await Customer.findOne({ customerId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const customerPhone = customer.phone;

    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    // ✅ Check daily booking limit for the specific type
    const bookingsOnDate = await Booking.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      type: type, // Filter by type
      status: { $ne: "Cancelled" }
    });
    // Max 3 bookings per day for each type
    if (bookingsOnDate >= 3) {
      return res.status(400).json({
        message: "Daily booking limit reached for this date. Please select another date."
      });
    }

    const booking = new Booking({ 
        customerId, 
        customerPhone, // ✅ Save the phone number
        type, 
        date: bookingDate, 
        village, 
        town, 
        status: "Pending" 
    });
    await booking.save();

    return res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    return res.status(500).json({ message: "Booking failed", error: error.message });
  }
};


// ------------------ GET LATEST BOOKING ------------------
exports.getLatestBooking = async (req, res) => {
  try {
    const { customerId } = req.params;
    const latestBooking = await Booking.findOne({ customerId }).sort({ createdAt: -1 });
    if (!latestBooking) {
      return res.status(404).json({ message: "No bookings found" });
    }
    return res.status(200).json(latestBooking);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch latest booking", error: error.message });
  }
};

// ------------------ GET ALL BOOKINGS ------------------
exports.getBookings = async (req, res) => {
  try {
    const { customerId } = req.params;
    const bookings = await Booking.find({ customerId }).sort({ createdAt: -1 });
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};

// ------------------ CANCEL BOOKING ------------------
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "Cancelled" },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json({ message: "Booking cancelled", booking });
  } catch (error) {
    return res.status(500).json({ message: "Cancel failed", error: error.message });
  }
};

// ------------------ RESCHEDULE BOOKING ------------------
exports.rescheduleBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { newDate } = req.body;
    const parsedDate = new Date(newDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid new date" });
    }
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const startOfDay = new Date(parsedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(parsedDate);
    endOfDay.setHours(23, 59, 59, 999);
    const bookingsOnDate = await Booking.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: "Cancelled" }
    });
    if (bookingsOnDate >= 3) {
      return res.status(400).json({ message: "Daily booking limit reached for this date" });
    }
    booking.date = parsedDate;
    booking.status = "Pending";
    await booking.save();
    return res.status(200).json({ message: "Booking rescheduled", booking });
  } catch (error) {
    return res.status(500).json({ message: "Reschedule failed", error: error.message });
  }
};
// ✅ NEW: Get all bills for a customer
exports.getBills = async (req, res) => {
  try {
    const { customerId } = req.params;
    const bills = await Bill.find({ customerId }).sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ message: "Failed to fetch bills", error: error.message });
  }
};


