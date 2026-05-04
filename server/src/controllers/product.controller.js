const mockProducts = require("../mockData/products.json");
const Product = require("../models/Product");
const Vendor = require("../models/Vendor");
const Booking = require("../models/Booking");


exports.createProduct = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const vendor = await Vendor.findOne({ user: req.user.userId });
    if (!vendor) {
      return res.status(403).json({ message: "Vendor profile not found" });
    }

    if (!vendor.isApproved) {
      return res.status(403).json({ message: "Vendor profile is not approved yet" });
    }

    const product = await Product.create({
      vendor: vendor._id,
      title: req.body.title,
      category: req.body.category,
      sizes: req.body.sizes || [],
      occasionTags: req.body.occasionTags || [],
      pricePerDay: req.body.pricePerDay,
      securityDeposit: req.body.securityDeposit || 0,
      bufferDays: req.body.bufferDays || 1,
      images: req.body.images || [],
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getMyProducts = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const vendor = await Vendor.findOne({ user: req.user.userId });
    if (!vendor) {
      return res.status(403).json({ message: "Vendor profile not found" });
    }

    const products = await Product.find({ vendor: vendor._id })
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    
    const query = { isActive: true };
    
    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.pricePerDay = {};
      if (req.query.minPrice) {
        query.pricePerDay.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.pricePerDay.$lte = Number(req.query.maxPrice);
      }
    }

    const products = await Product.find(query)
      .populate("vendor", "shopName address")
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    console.warn("⚠️  MongoDB error, using mock data:", error.message);
    
    res.json(mockProducts);
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("vendor", "shopName address");
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: error.message });
  }
};


exports.getProductAvailability = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 90);

    const bookings = await Booking.find({
      product: req.params.id,
      status: { $nin: ["CANCELLED", "RETURNED"] },
      endDate: { $gte: today },
      startDate: { $lte: futureDate }
    });

    
    const availability = [];
    
    
    const bookedDates = new Set();
    
    bookings.forEach(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      
      
      const bufferDays = product.bufferDays || 0;
      start.setDate(start.getDate() - bufferDays);
      end.setDate(end.getDate() + bufferDays);
      
      
      const current = new Date(start);
      while (current <= end) {
        const dateKey = current.toISOString().split('T')[0];
        bookedDates.add(dateKey);
        current.setDate(current.getDate() + 1);
      }
    });

    
    const currentDate = new Date(today);
    while (currentDate <= futureDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      availability.push({
        date: dateKey,
        status: bookedDates.has(dateKey) ? "booked" : "available"
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json(availability);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: error.message });
  }
};