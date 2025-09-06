const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/signup", adminController.adminSignup);
router.post("/login", adminController.adminLogin);
router.get("/bookings/type/:type", adminController.getBookingsByType);
router.put("/bookings/:bookingId/status", adminController.updateBookingStatus);
router.post("/bill", adminController.sendBill);
router.get("/warehouse-summary", adminController.getWarehouseSummary);
router.post("/warehouse/add-stock", adminController.addStock);

// ✅ NEW: Profile Routes
router.get("/profile/:adminId", adminController.getAdminProfile);
router.put("/profile/:adminId", adminController.updateAdminProfile);
module.exports = router;