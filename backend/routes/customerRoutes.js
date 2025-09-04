const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.post("/signup", customerController.customerSignup);
router.post("/login", customerController.customerLogin);

// booking routes
router.post("/book-bore", customerController.bookBore);
router.get("/:customerId/latest-booking", customerController.getLatestBooking); // ✅ NEW ROUTE
router.get("/:customerId/bookings", customerController.getBookings);
router.put("/booking/:bookingId/cancel", customerController.cancelBooking);
router.put("/booking/:bookingId/reschedule", customerController.rescheduleBooking);
// ✅ NEW route for bills
router.get("/:customerId/bills", customerController.getBills);

module.exports = router;