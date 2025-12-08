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
   CORS FIX FOR RENDER + VERCEL
----------------------------------------------------- */
const allowedOrigins = [
  "https://prime2-zb1z.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* -----------------------------------------------------
   BODY PARSER
----------------------------------------------------- */
app.use(express.json());

/* -----------------------------------------------------
   ROUTES
----------------------------------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/reviews", reviewsRoutes);

/* -----------------------------------------------------
   DATABASE + SERVER START
----------------------------------------------------- */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.error("DB error:", err));
