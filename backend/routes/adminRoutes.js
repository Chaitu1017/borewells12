const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/signup", adminController.adminSignup);
router.post("/login", adminController.adminLogin);
router.get("/bookings/type/:type", adminController.getBookingsByType);
router.put("/bookings/:bookingId/status", adminController.updateBookingStatus);
router.post("/bill", adminController.sendBill);
router.get("/warehouse-summary", adminController.getWarehouseSummary);
// ✅ NEW: Route to add stock
router.post("/warehouse/add-stock", adminController.addStock);

module.exports = router;