const mongoose = require("mongoose");
const Product = require("./models/Product");

// ---- IMPORTANT ----
// Replace with your EXACT MongoDB URI
const MONGO_URI = process.env.MONGO_URI || 
"mongodb+srv://thangapreethi85_db_user:86670noone34881@cluster0.xhecgcf.mongodb.net/primeDB?retryWrites=true&w=majority&appName=Cluster0";

const products = [
  {
    id: 1,
    name: "Apple Smart Watch",
    img: "/images/watch.jpg",
    price: 19999,
    category: "Wearables",
    description: "Premium smartwatch with health tracking."
  },
  {
    id: 2,
    name: "Sony WH-1000XM4 Headphones",
    img: "/images/headphone.jpg",
    price: 29999,
    category: "Audio",
    description: "Industry-leading noise cancellation."
  },
  {
    id: 3,
    name: "JBL Bluetooth Speaker",
    img: "/images/speaker.jpg",
    price: 6999,
    category: "Audio",
    description: "Portable speaker with powerful bass."
  },
  {
    id: 4,
    name: "Laptop Bag",
    img: "/images/laptopbag.jpg",
    price: 2499,
    category: "Accessories",
    description: "Quality leather bag for laptops."
  },
  {
    id: 5,
    name: "Nike Running Shoes",
    img: "/images/shoe.jpg",
    price: 4999,
    category: "Footwear",
    description: "Comfortable running shoes."
  },
    {
    id: 7,
    name: "Premium Belt",
    img: "/images/belt.png",
    price: 1499,
    category: "Wearables",
    description: "Stylish durable everyday wear belt."
  }
,
  {
    id: 8,
    name: "Block Heel",
    img: "/images/block_heel.png",
    price: 2999,
    category: "Footwear",
    description: "Elegant block heels for comfort."
  }
,
  {
    id: 9,
    name: "Slipper",
    img: "/images/pink_slipper.png",
    price: 999,
    category: "Footwear",
    description: "Soft comfy pink home slippers."
  }
,
  {
    id: 10,
    name: "Polaroid",
    img: "/images/polaroid.png",
    price: 10999,
    category: "Camera",
    description: "Vintage instant Polaroid camera prin."
  },
    {
    id: 11,
    name: "Premium Purse",
    img: "/images/purse.png",
    price: 1999,
    category: "Accesories",
    description: "Trendy spacious ladies carry purse."
  }
,
  {
    id: 12,
    name: "Spectacles",
    img: "/images/specs.png",
    price: 3999,
    category: "Wearables",
    description: "Lightweight stylish clear vision specs."
  }
,
  {
    id: 13,
    name: "Watch",
    img: "/images/watch2.png",
    price: 4999,
    category: "Wearables",
    description: "Classic sleek analog wrist watch."
  },
  {
    id: 6,
    name: "Canon DSLR Camera",
    img: "/images/camera.jpg",
    price: 45999,
    category: "Camera",
    description: "High-resolution camera for enthusiasts and pros."
  },
  

];


async function start() {
  try {
    console.log("Connecting to MongoDB...");
    
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 20000
    });

    console.log("MongoDB Connected!");

    console.log("Clearing old products...");
    await Product.deleteMany({});

    console.log("Inserting new products...");
    await Product.insertMany(products);

    console.log("Products seeded successfully!");
    process.exit();

  } catch (err) {
    console.error("❌ ERROR:", err);
    process.exit(1);
  }
}

start();
