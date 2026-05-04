const express = require("express");
const router = express.Router();
const { 
  register, 
  login, 
  forgotPassword, 
  verifyOTP, 
  resetPassword,
  getCurrentUser 
} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateVerifyOTP,
  validateResetPassword,
} = require("../middlewares/validation.middleware");

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/verify-otp", validateVerifyOTP, verifyOTP);
router.post("/reset-password", validateResetPassword, resetPassword);
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
