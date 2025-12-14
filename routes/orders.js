const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

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
      meta
    } = req.body;

    if (!invoiceNumber || !email || !items || !total) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const order = new Order({
      invoiceNumber,
      email,
      userId: userId || req.user?._id || null,
      items,
      total,
      status: status || "Placed",
      meta: meta || {}
    });

    const saved = await order.save();

    return res.json({ ok: true, order: saved });
  } catch (err) {
    console.error("Order save failed:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
});

/* ------------------------
   GET USER ORDERS
--------------------------- */
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error("Order fetch error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

/* ------------------------
   ORDER TRACKING (BY INVOICE)
--------------------------- */
router.get("/track/:invoiceNumber", async (req, res) => {
  try {
    const order = await Order.findOne({ invoiceNumber: req.params.invoiceNumber });
    if (!order) return res.status(404).json({ msg: "Order not found" });

    return res.json(order);
  } catch (err) {
    console.error("Track order error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

/* ------------------------
   OPTIONAL: SEND EMAIL (If you enabled email in backend)
--------------------------- */
router.post("/:id/send-email", async (req, res) => {
  try {
    const { email } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    // If you added sendEmail function earlier:
    // await sendEmail(email, "Your PrimeShop Invoice", `<p>Your invoice: ${order.invoiceNumber}</p>`);

    return res.json({ ok: true, msg: "Email sent (if configured)" });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
