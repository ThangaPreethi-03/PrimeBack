// routes/orders.js
const express = require("express");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const sendEmail = require("../utils/sendMail");

const router = express.Router();

/* ------------------------
   OPTIONAL AUTH MIDDLEWARE
--------------------------- */
const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    }
  } catch (err) {
    console.warn("Invalid or expired token");
  }
  next();
};

/* ------------------------
   CREATE ORDER
--------------------------- */
router.post("/", optionalAuth, async (req, res) => {
  try {
    const {
      invoiceNumber,
      email,
      userId,
      items,
      total,
      status,
      meta,
    } = req.body;

    if (!invoiceNumber || !email || !items || !total) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const order = new Order({
      invoiceNumber,
      email,
      userId: userId || req.user?.id || null,
      items,
      total,
      status: status || "Placed",
      meta: meta || {},
    });

    const saved = await order.save();

    /* ------------------------
       SEND EMAIL (🔥 FIX)
    --------------------------- */
    sendEmail(
      email,
      "Your PrimeShop Order Confirmation",
      `
        <h2>Thank you for your order!</h2>
        <p><strong>Invoice:</strong> ${invoiceNumber}</p>
        <p><strong>Total:</strong> ₹${total}</p>
        <p>Status: ${saved.status}</p>
        <br/>
        <p>— PrimeShop Team</p>
      `
    );

    res.json({ ok: true, order: saved });
  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

/* ------------------------
   GET USER ORDERS
--------------------------- */
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("FETCH USER ORDERS ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ------------------------
   TRACK ORDER BY INVOICE
--------------------------- */
router.get("/track/:invoiceNumber", async (req, res) => {
  try {
    const order = await Order.findOne({
      invoiceNumber: req.params.invoiceNumber,
    });

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("TRACK ORDER ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
