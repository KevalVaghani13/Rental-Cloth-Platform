const { body, param, validationResult } = require("express-validator");


const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};


const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  handleValidationErrors,
];

const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

const validateForgotPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  handleValidationErrors,
];

const validateVerifyOTP = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),
  handleValidationErrors,
];

const validateResetPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("resetToken")
    .trim()
    .notEmpty()
    .withMessage("Reset token is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  handleValidationErrors,
];


const validateCreateBooking = [
  body("productId")
    .trim()
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID format"),
  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid date"),
  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid date"),
  handleValidationErrors,
];

const validatePayment = [
  body("paymentAmount")
    .notEmpty()
    .withMessage("Payment amount is required")
    .isNumeric()
    .withMessage("Payment amount must be a number")
    .custom((value) => {
      if (value <= 0) {
        throw new Error("Payment amount must be greater than 0");
      }
      return true;
    }),
  handleValidationErrors,
];

const validateBookingId = [
  param("id")
    .notEmpty()
    .withMessage("Booking ID is required")
    .isMongoId()
    .withMessage("Invalid booking ID format"),
  handleValidationErrors,
];


const validateCreateProduct = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["Saree", "Lehenga", "Sherwani", "Chaniya Choli", "Other"])
    .withMessage("Invalid category"),
  body("pricePerDay")
    .notEmpty()
    .withMessage("Price per day is required")
    .isNumeric()
    .withMessage("Price per day must be a number")
    .custom((value) => {
      if (value <= 0) {
        throw new Error("Price per day must be greater than 0");
      }
      return true;
    }),
  body("securityDeposit")
    .optional()
    .isNumeric()
    .withMessage("Security deposit must be a number")
    .custom((value) => {
      if (value < 0) {
        throw new Error("Security deposit cannot be negative");
      }
      return true;
    }),
  body("bufferDays")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Buffer days must be a non-negative integer"),
  body("sizes")
    .optional()
    .isArray()
    .withMessage("Sizes must be an array"),
  body("occasionTags")
    .optional()
    .isArray()
    .withMessage("Occasion tags must be an array"),
  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array"),
  handleValidationErrors,
];


const validateCreateVendor = [
  body("shopName")
    .trim()
    .notEmpty()
    .withMessage("Shop name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Shop name must be between 2 and 100 characters"),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Address must be between 10 and 500 characters"),
  body("bankDetails")
    .optional()
    .isObject()
    .withMessage("Bank details must be an object"),
  body("bankDetails.accountHolderName")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Account holder name must be at least 2 characters"),
  body("bankDetails.accountNumber")
    .optional()
    .trim()
    .isNumeric()
    .withMessage("Account number must contain only digits"),
  body("bankDetails.ifscCode")
    .optional()
    .trim()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
    .withMessage("Invalid IFSC code format"),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateVerifyOTP,
  validateResetPassword,
  validateCreateBooking,
  validatePayment,
  validateBookingId,
  validateCreateProduct,
  validateCreateVendor,
};
