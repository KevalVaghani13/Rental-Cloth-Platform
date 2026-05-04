const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/authorize.middleware");
const { validateCreateVendor } = require("../middlewares/validation.middleware");

const {
  createVendor,
  getMyVendorProfile,
} = require("../controllers/vendor.controller");


router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  validateCreateVendor,
  createVendor
);


router.get(
  "/me",
  protect,
  authorizeRoles("VENDOR"),
  getMyVendorProfile
);

module.exports = router;
