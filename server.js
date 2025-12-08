// server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const stripeRoutes = require("./routes/stripe");
const reviewsRoutes = require("./routes/reviews");

const app = express();

/* -----------------------------------------------------
   ✅ FIXED CORS FOR DEPLOYMENT (Render → Vercel)
----------------------------------------------------- */
const allowedOrigins = [
  "https://prime2-zb1z.vercel.app", // your production frontend
  "http://localhost:5173",          // development frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed for origin: " + origin), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// For OPTIONS preflight requests
app.options("*", cors());

/* -----------------------------------------------------
   🔥 BODY PARSER
----------------------------------------------------- */
app.use(express.json());

/* -----------------------------------------------------
   🔥 API ROUTES 
----------------------------------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/reviews", reviewsRoutes);

/* -----------------------------------------------------
   🔥 DB CONNECTION 
----------------------------------------------------- */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));
