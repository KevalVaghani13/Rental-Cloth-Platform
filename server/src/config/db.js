const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    console.log("🔄 Connecting to MongoDB...");
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, 
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected");
    });

    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
      console.warn("⚠️  Starting server with mock data fallback...");
      return null;
  }
};

module.exports = connectDB;
