// routes/reviews.js
const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

/* =========================
   CREATE REVIEW
========================= */
router.post("/", async (req, res) => {
  try {
    const { productId, rating, comment, user } = req.body;

    if (!productId || !rating || !user) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const review = new Review({
      productId,
      rating,
      comment,
      user,
    });

    const saved = await review.save();
    res.json(saved);
  } catch (err) {
    console.error("CREATE REVIEW ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================
   GET REVIEWS BY PRODUCT
========================= */
router.get("/product/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
    }).sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error("FETCH REVIEWS ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
