// server.js — FINAL SAFE VERSION (VERCEL + RENDER)

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

/* ---------------- ROUTES ---------------- */
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/users");
const paymentRoutes = require("./routes/payments");

const app = express();

/* ------------------------------------------------
   CORS CONFIG — FIXES REGISTER / LOGIN / CHECK-EMAIL
-------------------------------------------------- */

const FRONTEND = process.env.FRONTEND_URL || "https://prime2-zb1z.vercel.app";

app.use(
  cors({
    origin: [
      FRONTEND,
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight properly
app.options("*", cors());

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

/* ---------------- ROUTES ---------------- */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);      // ✅ ONLY ONCE
app.use("/api/payments", paymentRoutes);

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.send("PrimeShop backend running ✔️");
});

/* ---------------- 404 HANDLER ---------------- */
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

/* ---------------- ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  if (res.headersSent) return next(err);
  res.status(500).json({ msg: err.message || "Server error" });
});

/* ---------------- DB + SERVER ---------------- */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✔️");
    app.listen(PORT, () =>
      console.log(`Backend running on port ${PORT} ✔️`)
    );
  })
  .catch((err) => {
    console.error("MongoDB ERROR:", err);
    process.exit(1);
  });

/* ---------------- GRACEFUL SHUTDOWN ---------------- */
process.on("SIGINT", () => {
  console.log("Gracefully shutting down...");
  mongoose.disconnect().then(() => process.exit(0));
});
