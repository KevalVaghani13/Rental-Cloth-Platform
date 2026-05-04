const express = require("express");
const router = express.Router();

const { getProductAvailability } = require("../controllers/product.controller");


router.get("/:id", getProductAvailability);

module.exports = router;
