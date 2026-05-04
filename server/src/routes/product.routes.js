const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/authorize.middleware");
const { validateCreateProduct } = require("../middlewares/validation.middleware");

const {
  createProduct,
  getAllProducts,
  getMyProducts,
  getProductById,
  getProductAvailability,
} = require("../controllers/product.controller");


router.get("/", getAllProducts);


router.get(
  "/my/products",
  protect,
  authorizeRoles("VENDOR"),
  getMyProducts
);


router.get("/:id", getProductById);


router.get("/:id/availability", getProductAvailability);


router.post(
  "/",
  protect,
  authorizeRoles("VENDOR"),
  validateCreateProduct,
  createProduct
);

module.exports = router;
