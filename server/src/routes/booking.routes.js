const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/authorize.middleware");
const {
  validateCreateBooking,
  validatePayment,
  validateBookingId,
} = require("../middlewares/validation.middleware");

const {
  createBooking,
  confirmBooking,
  mockPayment,
  getMyBookings,
  getBookingById,
  cancelBooking,
  markAsPickedUp,
  returnBooking,
} = require("../controllers/booking.controller");


router.get(
  "/",
  protect,
  getMyBookings
);


router.get(
  "/my",
  protect,
  getMyBookings
);


router.get(
  "/:id",
  protect,
  validateBookingId,
  getBookingById
);


router.post(
  "/",
  protect,
  authorizeRoles("CUSTOMER"),
  validateCreateBooking,
  createBooking
);


router.patch(
  "/:id/confirm",
  protect,
  authorizeRoles("VENDOR"),
  validateBookingId,
  confirmBooking
);


router.post(
  "/:id/pay",
  protect,
  authorizeRoles("CUSTOMER"),
  validateBookingId,
  validatePayment,
  mockPayment
);


router.patch(
  "/:id/cancel",
  protect,
  authorizeRoles("CUSTOMER"),
  validateBookingId,
  cancelBooking
);


router.patch(
  "/:id/pickup",
  protect,
  validateBookingId,
  markAsPickedUp
);


router.patch(
  "/:id/return",
  protect,
  validateBookingId,
  returnBooking
);

module.exports = router;
