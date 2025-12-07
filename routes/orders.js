// prime-shop-backend/routes/orders.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// GET all orders (admin / debug)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET orders for a specific userId (recommended for My Orders)
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    // If userId looks like ObjectId, query by userId, else try by stored string
    const query = { $or: [{ userId }, { userId: req.params.userId }] };
    // also include fallback: some orders might only have email, not userId
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET single order by invoiceNumber or by _id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Prefer invoiceNumber match first (string)
    let order = await Order.findOne({ invoiceNumber: id });

    // if not found, try by _id (ObjectId)
    if (!order) {
      try {
        order = await Order.findById(id);
      } catch (e) {
        // invalid ObjectId - ignore
      }
    }

    if (!order) return res.status(404).json({ msg: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// CREATE order (used by frontend / stripe webhook etc.)
// Body should include: invoiceNumber, email, items, total, optional userId, metadata
router.post("/", async (req, res) => {
  try {
    const { invoiceNumber, email, items, total, userId, status = "Placed", metadata } = req.body;

    if (!invoiceNumber || !email || !items || !total) {
      return res.status(400).json({ msg: "Missing required order fields" });
    }

    const order = new Order({
      invoiceNumber,
      email,
      items,
      total,
      userId: userId || undefined,
      status,
      metadata: metadata || {}
    });

    await order.save();
    res.json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// UPDATE order status (admin or internal)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const order = await Order.findOne({ $or: [{ invoiceNumber: id }, { _id: id }] });
    if (!order) return res.status(404).json({ msg: "Order not found" });

    order.status = status || order.status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
