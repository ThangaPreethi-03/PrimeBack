// server.js — FINAL CORS-FIXED VERSION (RENDER + VERCEL SAFE)

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ===============================
   ALLOWED ORIGINS
================================ */
const allowedOrigins = [
  "https://prime2-zb1z.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

/* ===============================
   CORS CONFIG (CORRECT WAY)
================================ */
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false); // ❗ do NOT throw error
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


/* ===============================
   BODY PARSERS
================================ */
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

/* ===============================
   ROUTES
================================ */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/users", require("./routes/users"));

app.use("/api/reviews", require("./routes/reviews"));

app.use("/api/payments", require("./routes/payments"));

/* ===============================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.send("PrimeShop backend running ✔️");
});

/* ===============================
   404 HANDLER
================================ */
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

/* ===============================
   ERROR HANDLER
================================ */
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);
  res.status(500).json({ msg: err.message });
});

/* ===============================
   DB + SERVER START
================================ */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI");
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
    console.error("MongoDB error:", err);
    process.exit(1);
  });





