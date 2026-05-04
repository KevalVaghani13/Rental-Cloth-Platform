const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });


const requiredEnvVars = ["JWT_SECRET", "MONGO_URI"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error("❌ FATAL ERROR: Missing required environment variables:");
  missingEnvVars.forEach((envVar) => {
    console.error(`   - ${envVar}`);
  });
  console.error("\nPlease create a .env file with the required variables.");
  console.error("See .env.example for reference.\n");
  process.exit(1);
}


if (process.env.JWT_SECRET.length < 32) {
  console.warn("⚠️  WARNING: JWT_SECRET should be at least 32 characters for security.");
}

const app = require("./src/app");
const connectDB = require("./src/config/db");


const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 API URL: http://localhost:${PORT}`);
      console.log(`❤️  Health check: http://localhost:${PORT}/health\n`);
    });

    
    process.on("unhandledRejection", (err) => {
      console.error("❌ UNHANDLED REJECTION! Shutting down...");
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    
    process.on("uncaughtException", (err) => {
      console.error("❌ UNCAUGHT EXCEPTION! Shutting down...");
      console.error(err.name, err.message);
      process.exit(1);
    });

    
    process.on("SIGTERM", () => {
      console.log("👋 SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        console.log("💤 Process terminated.");
      });
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
