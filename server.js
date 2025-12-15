// server.js — FINAL SAFE VERSION (RENDER FIXED)

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

/* ---------------- CORS ---------------- */
const FRONTEND = process.env.FRONTEND_URL || "https://prime2-zb1z.vercel.app";

app.use(
  cors({
    origin: [
      FRONTEND,
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

/* ---------------- ROUTES ---------------- */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);

/* ---------------- HEALTH ---------------- */
app.get("/", (req, res) => {
  res.send("PrimeShop backend running ✔️");
});

/* ---------------- 404 ---------------- */
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

/* ---------------- ERROR ---------------- */
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  if (res.headersSent) return next(err);
  res.status(500).json({ msg: err.message || "Server error" });
});

/* ---------------- DB + SERVER ---------------- */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

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
