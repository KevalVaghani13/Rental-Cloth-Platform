const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/authorize.middleware");

const Booking = require("../models/Booking");
const User = require("../models/User");
const Vendor = require("../models/Vendor");
const Product = require("../models/Product");


router.get(
  "/bookings",
  protect,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate("product", "title category pricePerDay")
        .populate("vendor", "name email")
        .populate("customer", "name email")
        .sort({ createdAt: -1 });

      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


router.get(
  "/users",
  protect,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


router.get(
  "/vendors",
  protect,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const vendors = await Vendor.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });

      res.json(vendors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


router.patch(
  "/vendors/:id/approve",
  protect,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const vendor = await Vendor.findByIdAndUpdate(
        req.params.id,
        { isApproved: true },
        { new: true }
      ).populate("user", "name email");

      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      res.json({
        message: "Vendor approved successfully",
        vendor,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


router.get(
  "/stats",
  protect,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const [
        totalUsers,
        totalVendors,
        totalProducts,
        totalBookings,
        pendingBookings,
        completedBookings,
      ] = await Promise.all([
        User.countDocuments(),
        Vendor.countDocuments(),
        Product.countDocuments(),
        Booking.countDocuments(),
        Booking.countDocuments({ status: "BOOKED" }),
        Booking.countDocuments({ status: "RETURNED" }),
      ]);

      res.json({
        totalUsers,
        totalVendors,
        totalProducts,
        totalBookings,
        pendingBookings,
        completedBookings,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
