const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.post("/signup", customerController.customerSignup);
router.post("/login", customerController.customerLogin);
router.post("/book-bore", customerController.bookBore);
router.get("/:customerId/latest-booking", customerController.getLatestBooking);
router.get("/:customerId/bookings", customerController.getBookings);
router.put("/booking/:bookingId/cancel", customerController.cancelBooking);
router.put("/booking/:bookingId/reschedule", customerController.rescheduleBooking);
router.get("/:customerId/bills", customerController.getBills);
router.get("/profile/:customerId", customerController.getCustomerProfile);
router.put("/profile/:customerId", customerController.updateCustomerProfile);
router.post("/review", customerController.submitReview);
// ✅ NEW: Route to get reviews for a specific customer
router.get("/:customerId/reviews", customerController.getCustomerReviews);

module.exports = router;