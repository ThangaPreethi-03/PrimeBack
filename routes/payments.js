const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

function optionalAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) { /* ignore */ }
  next();
}

// Create a payment session (minimal)
router.post("/create-session", optionalAuth, async (req, res) => {
  try {
    const { items, total, method, meta } = req.body;
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    const order = new Order({
      invoiceNumber,
      userId: req.user?.id || null,
      email: req.user?.email || (req.body.email || "guestuser@example.com"),
      items: items.map(i => ({ name: i.name, price: i.price, qty: i.qty })),
      total,
      status: "Placed",
      meta: { paymentMethod: method || "COD", ...(meta || {}) }
    });

    const saved = await order.save();
    return res.json({ ok: true, order: saved });
  } catch (err) {
    console.error("Payment create error:", err);
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
