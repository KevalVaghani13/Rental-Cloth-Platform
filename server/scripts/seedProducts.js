

const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Product = require("../src/models/Product");
const Vendor = require("../src/models/Vendor");
const User = require("../src/models/User");


const SAMPLE_IMAGES = {
  Saree: [
    "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3536993/pexels-photo-3536993.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2995309/pexels-photo-2995309.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  Lehenga: [
    "https://images.pexels.com/photos/2995309/pexels-photo-2995309.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3536993/pexels-photo-3536993.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  Sherwani: [
    "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3622614/pexels-photo-3622614.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  "Chaniya Choli": [
    "https://images.pexels.com/photos/2995309/pexels-photo-2995309.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3536993/pexels-photo-3536993.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  Other: [
    "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3536993/pexels-photo-3536993.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
};


const sampleProducts = [
  {
    title: "Elegant Red Banarasi Silk Saree",
    category: "Saree",
    sizes: ["Free Size"],
    occasionTags: ["Wedding", "Festival", "Party"],
    pricePerDay: 1500,
    securityDeposit: 5000,
    bufferDays: 2,
    images: SAMPLE_IMAGES.Saree,
  },
  {
    title: "Royal Blue Kanjivaram Saree",
    category: "Saree",
    sizes: ["Free Size"],
    occasionTags: ["Wedding", "Reception"],
    pricePerDay: 2000,
    securityDeposit: 8000,
    bufferDays: 2,
    images: SAMPLE_IMAGES.Saree,
  },
  {
    title: "Designer Bridal Lehenga - Maroon Gold",
    category: "Lehenga",
    sizes: ["S", "M", "L", "XL"],
    occasionTags: ["Wedding", "Engagement", "Reception"],
    pricePerDay: 5000,
    securityDeposit: 15000,
    bufferDays: 3,
    images: SAMPLE_IMAGES.Lehenga,
  },
  {
    title: "Pastel Pink Embroidered Lehenga",
    category: "Lehenga",
    sizes: ["XS", "S", "M", "L"],
    occasionTags: ["Engagement", "Sangeet", "Party"],
    pricePerDay: 3500,
    securityDeposit: 10000,
    bufferDays: 2,
    images: SAMPLE_IMAGES.Lehenga,
  },
  {
    title: "Classic Ivory Sherwani with Embroidery",
    category: "Sherwani",
    sizes: ["S", "M", "L", "XL", "XXL"],
    occasionTags: ["Wedding", "Reception"],
    pricePerDay: 4000,
    securityDeposit: 12000,
    bufferDays: 2,
    images: SAMPLE_IMAGES.Sherwani,
  },
  {
    title: "Navy Blue Designer Sherwani",
    category: "Sherwani",
    sizes: ["M", "L", "XL"],
    occasionTags: ["Wedding", "Engagement", "Festival"],
    pricePerDay: 3000,
    securityDeposit: 10000,
    bufferDays: 2,
    images: SAMPLE_IMAGES.Sherwani,
  },
  {
    title: "Traditional Gujarati Chaniya Choli - Red",
    category: "Chaniya Choli",
    sizes: ["S", "M", "L"],
    occasionTags: ["Navratri", "Garba", "Festival"],
    pricePerDay: 2500,
    securityDeposit: 7000,
    bufferDays: 2,
    images: SAMPLE_IMAGES["Chaniya Choli"],
  },
  {
    title: "Mirror Work Chaniya Choli - Multi Color",
    category: "Chaniya Choli",
    sizes: ["XS", "S", "M", "L", "XL"],
    occasionTags: ["Navratri", "Dandiya", "Festival"],
    pricePerDay: 3000,
    securityDeposit: 8000,
    bufferDays: 2,
    images: SAMPLE_IMAGES["Chaniya Choli"],
  },
  {
    title: "Premium Green Silk Saree with Zari",
    category: "Saree",
    sizes: ["Free Size"],
    occasionTags: ["Wedding", "Festival", "Puja"],
    pricePerDay: 1800,
    securityDeposit: 6000,
    bufferDays: 2,
    images: SAMPLE_IMAGES.Saree,
  },
  {
    title: "Gold Embroidered Bridal Sherwani",
    category: "Sherwani",
    sizes: ["S", "M", "L", "XL"],
    occasionTags: ["Wedding", "Reception"],
    pricePerDay: 6000,
    securityDeposit: 20000,
    bufferDays: 3,
    images: SAMPLE_IMAGES.Sherwani,
  },
  {
    title: "Designer Purple Lehenga with Dupatta",
    category: "Lehenga",
    sizes: ["S", "M", "L"],
    occasionTags: ["Sangeet", "Party", "Reception"],
    pricePerDay: 4500,
    securityDeposit: 12000,
    bufferDays: 2,
    images: SAMPLE_IMAGES.Lehenga,
  },
  {
    title: "Traditional Patola Saree - Yellow",
    category: "Saree",
    sizes: ["Free Size"],
    occasionTags: ["Wedding", "Festival", "Traditional"],
    pricePerDay: 2500,
    securityDeposit: 10000,
    bufferDays: 2,
    images: SAMPLE_IMAGES.Saree,
  },
];

async function seedProducts() {
  try {
    
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/rental-platform";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    
    let vendor = await Vendor.findOne({ isApproved: true });

    if (!vendor) {
      console.log("⚠️ No approved vendor found. Creating a sample vendor...");

      
      let user = await User.findOne({ email: "vendor@example.com" });
      if (!user) {
        user = await User.create({
          fullName: "Sample Vendor",
          email: "vendor@example.com",
          phone: "9876543210",
          password: "password123", 
          role: "vendor",
        });
        console.log("✅ Created sample vendor user");
      }

      
      vendor = await Vendor.create({
        user: user._id,
        shopName: "Traditional Elegance",
        gstin: "22AAAAA0000A1Z5",
        address: "123 Fashion Street, Mumbai, Maharashtra",
        isApproved: true,
      });
      console.log("✅ Created and approved sample vendor");
    }

    console.log(`📦 Using vendor: ${vendor.shopName}`);

    
    const existingCount = await Product.countDocuments();
    console.log(`📊 Existing products in database: ${existingCount}`);

    
    
    

    
    const productsToCreate = sampleProducts.map((product) => ({
      ...product,
      vendor: vendor._id,
    }));

    const createdProducts = await Product.insertMany(productsToCreate);
    console.log(`✅ Created ${createdProducts.length} sample products`);

    
    console.log("\n📋 Products created:");
    createdProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - ₹${product.pricePerDay}/day (${product.images.length} images)`);
    });

    console.log("\n🎉 Seeding completed successfully!");

  } catch (error) {
    console.error("❌ Error seeding products:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}


seedProducts();
