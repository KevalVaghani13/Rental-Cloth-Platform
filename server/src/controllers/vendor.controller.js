const Vendor = require("../models/Vendor");
const User = require("../models/User");


exports.createVendor = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, shopName, address, bankDetails } = req.body;

    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required to create vendor" });
    }

    
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const existingVendor = await Vendor.findOne({ user: userId });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor profile already exists for this user" });
    }

    
    const vendor = await Vendor.create({
      user: userId,
      shopName,
      address,
      bankDetails: bankDetails || {},
      isApproved: true, 
    });

    
    await User.findByIdAndUpdate(userId, { role: "VENDOR" });

    res.status(201).json({
      message: "Vendor profile created successfully",
      vendor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getMyVendorProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const vendor = await Vendor.findOne({ user: req.user.userId }).populate(
      "user",
      "name email"
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }

    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
