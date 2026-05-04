const express = require("express");
const router = express.Router();
const upload = require("../config/upload");
const path = require("path");
const fs = require("fs");


router.post("/products", upload.array("images", 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrls = req.files.map(
      (file) => `${baseUrl}/uploads/products/${file.filename}`
    );

    res.status(200).json({
      message: "Images uploaded successfully",
      images: imageUrls,
      count: imageUrls.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/product", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/uploads/products/${req.file.filename}`;

    res.status(200).json({
      message: "Image uploaded successfully",
      image: imageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete("/products/:filename", (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../uploads/products",
      req.params.filename
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: "Image deleted successfully" });
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.use((error, req, res, next) => {
  if (error instanceof require("multer").MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Maximum size is 5MB." });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ message: "Too many files. Maximum is 5 files." });
    }
  }
  res.status(400).json({ message: error.message });
});

module.exports = router;
