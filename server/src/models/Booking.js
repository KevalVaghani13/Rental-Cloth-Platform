const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    
    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    
    rentalAmount: {
      type: Number,
      required: true,
    },

    depositAmount: {
      type: Number,
      default: 0,
    },

    paymentAmount: {
      type: Number,
      default: 0, 
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
    },

    
    status: {
      type: String,
      enum: [
        "BOOKED",
        "CONFIRMED",
        "PICKED_UP",
        "RETURNED",
        "LATE_RETURN",
        "CANCELLED",
      ],
      default: "BOOKED",
    },

    
    pickupDate: {
      type: Date,
    },

    returnDate: {
      type: Date,
    },

    lateFee: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
