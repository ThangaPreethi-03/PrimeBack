// prime-shop-backend/routes/reviews.js
const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// GET all reviews for a product
router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// POST a review for a product
// body: { userId, name, rating, text, metadata }
router.post("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, name, rating, text, metadata } = req.body;

    if (!name || !rating) {
      return res.status(400).json({ msg: "Missing name or rating" });
    }

    const review = new Review({
      productId,
      userId: userId || undefined,
      name,
      rating,
      text: text || "",
      metadata: metadata || {}
    });

    await review.save();
    res.json(review);
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
