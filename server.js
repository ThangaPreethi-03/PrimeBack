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
   🔥 FIXED CORS COMPLETELY FOR EXPRESS v5
----------------------------------------------------- */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// REMOVE ❌ app.options("*", cors());
// Express v5 does NOT support '*' route here

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
   🔥 DATABASE CONNECTION 
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
