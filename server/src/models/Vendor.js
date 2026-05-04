const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    shopName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    commissionRate: {
      type: Number,
      default: 10, 
    },
    isApproved: {
      type: Boolean,
      default: false, 
    },
    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      ifscCode: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
