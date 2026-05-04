const Booking = require("../models/Booking");
const Product = require("../models/Product");
const Vendor = require("../models/Vendor");


const calculateRentalAmount = (startDate, endDate, pricePerDay) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; 
  return days * pricePerDay;
};


exports.createBooking = async (req, res) => {
  try {
    
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { productId, startDate, endDate } = req.body;

    
    if (!productId || !startDate || !endDate) {
      return res.status(400).json({ 
        message: "Product ID, start date, and end date are required" 
      });
    }

    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (start < today) {
      return res.status(400).json({ message: "Start date cannot be in the past" });
    }

    if (end < start) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.isActive) {
      return res.status(400).json({ message: "Product is not available for booking" });
    }

    
    const vendor = await Vendor.findById(product.vendor);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found for this product" });
    }

    
    const conflictingBooking = await Booking.findOne({
      product: productId,
      status: { $nin: ["CANCELLED", "RETURNED"] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (conflictingBooking) {
      return res.status(409).json({ 
        message: "Product is already booked for the selected dates" 
      });
    }

    
    const rentalAmount = calculateRentalAmount(startDate, endDate, product.pricePerDay);
    const depositAmount = product.securityDeposit || 0;
    const totalAmount = rentalAmount + depositAmount;

    const booking = await Booking.create({
      product: productId,
      vendor: vendor.user,
      customer: req.user.userId,
      startDate: start,
      endDate: end,
      rentalAmount,
      depositAmount,
      paymentAmount: 0, 
      paymentStatus: "PENDING",
      status: "BOOKED",
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("product", "title pricePerDay images")
      .populate("customer", "name email");

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking,
      totalAmount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.confirmBooking = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    
    if (booking.vendor.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to confirm this booking" });
    }

    
    if (booking.status !== "BOOKED") {
      return res.status(400).json({ 
        message: `Cannot confirm booking with status: ${booking.status}` 
      });
    }

    
    if (booking.paymentStatus !== "PAID") {
      return res.status(400).json({ message: "Payment must be completed before confirmation" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "CONFIRMED" },
      { new: true }
    ).populate("product", "title pricePerDay images")
     .populate("customer", "name email");

    res.json({
      message: "Booking confirmed successfully",
      booking: updatedBooking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.mockPayment = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { paymentAmount } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    
    if (booking.customer.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to pay for this booking" });
    }

    
    if (booking.paymentStatus === "PAID") {
      return res.status(400).json({ message: "Booking is already paid" });
    }

    
    const expectedTotal = booking.rentalAmount + booking.depositAmount;

    
    if (!paymentAmount || typeof paymentAmount !== "number" || paymentAmount <= 0) {
      return res.status(400).json({ message: "Valid payment amount is required" });
    }

    if (paymentAmount !== expectedTotal) {
      return res.status(400).json({ 
        message: `Payment amount must be ${expectedTotal}. You provided ${paymentAmount}.`,
        expectedAmount: expectedTotal,
      });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus: "PAID",
        paymentAmount: expectedTotal,
      },
      { new: true }
    ).populate("product", "title pricePerDay images")
     .populate("customer", "name email");

    res.json({
      message: "Payment successful",
      booking: updatedBooking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getMyBookings = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let query = {};
    
    if (req.user.role === "CUSTOMER") {
      query.customer = req.user.userId;
    } else if (req.user.role === "VENDOR") {
      query.vendor = req.user.userId;
    } else if (req.user.role === "ADMIN") {
      
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    const bookings = await Booking.find(query)
      .populate("product", "title pricePerDay images category")
      .populate("customer", "name email")
      .populate("vendor", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getBookingById = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const booking = await Booking.findById(req.params.id)
      .populate("product", "title pricePerDay images category")
      .populate("customer", "name email")
      .populate("vendor", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    
    const isCustomer = booking.customer._id.toString() === req.user.userId.toString();
    const isVendor = booking.vendor._id.toString() === req.user.userId.toString();
    const isAdmin = req.user.role === "ADMIN";

    if (!isCustomer && !isVendor && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.cancelBooking = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    
    if (booking.customer.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to cancel this booking" });
    }

    
    if (booking.status !== "BOOKED") {
      return res.status(400).json({ 
        message: `Cannot cancel booking with status: ${booking.status}` 
      });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "CANCELLED" },
      { new: true }
    ).populate("product", "title pricePerDay images")
     .populate("customer", "name email");

    res.json({
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.markAsPickedUp = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    
    const isVendor = booking.vendor.toString() === req.user.userId.toString();
    const isCustomer = booking.customer.toString() === req.user.userId.toString();
    
    if (!isVendor && !isCustomer) {
      return res.status(403).json({ message: "You are not authorized to update this booking" });
    }

    
    if (!["BOOKED", "CONFIRMED"].includes(booking.status)) {
      return res.status(400).json({ 
        message: `Cannot mark as picked up. Current status: ${booking.status}` 
      });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "PICKED" },
      { new: true }
    ).populate("product", "title pricePerDay images category")
     .populate("customer", "name email");

    res.json({
      message: "Booking marked as picked up",
      booking: updatedBooking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.returnBooking = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    
    const isVendor = booking.vendor.toString() === req.user.userId.toString();
    const isCustomer = booking.customer.toString() === req.user.userId.toString();
    
    if (!isVendor && !isCustomer) {
      return res.status(403).json({ message: "You are not authorized to return this booking" });
    }

    
    if (booking.status !== "PICKED") {
      return res.status(400).json({ 
        message: `Cannot return booking. Current status: ${booking.status}. Product must be picked up first.` 
      });
    }

    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(booking.endDate);
    endDate.setHours(0, 0, 0, 0);
    
    const isLate = today > endDate;

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { 
        status: "RETURNED",
        returnedAt: new Date(),
        isLateReturn: isLate
      },
      { new: true }
    ).populate("product", "title pricePerDay images category")
     .populate("customer", "name email");

    res.json({
      message: isLate 
        ? "Product returned (late return recorded)" 
        : "Product returned successfully",
      booking: updatedBooking,
      isLateReturn: isLate
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
