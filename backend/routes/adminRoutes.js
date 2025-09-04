const express = require("express");
const router = express.Router();
// ✅ CHANGE: Import the entire adminController object, not just specific functions.
const adminController = require("../controllers/adminController"); 
const Booking = require("../models/Booking"); // Needed for the populate example

router.post("/signup", adminController.adminSignup);
router.post("/login", adminController.adminLogin);

// ✅ UPDATED route to use a controller function
router.get("/bookings", adminController.getAllBookings);
// ✅ NEW routes for filtering and updating bookings
router.get("/bookings/type/:type", adminController.getBookingsByType);
router.put("/bookings/:bookingId/status", adminController.updateBookingStatus);
// ✅ NEW route for sending a bill
router.post("/bill", adminController.sendBill);


module.exports = router;