// routes/reviews.js
const express = require("express");
const Review = require("../models/Review");

const router = express.Router();

/* ===============================
   CREATE REVIEW
================================ */
router.post("/", async (req, res) => {
  try {
    const {
      productId,
      userId,
      userName,
      rating,
      comment,
    } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const review = new Review({
      productId,
      userId: userId || null,
      userName: userName || "Anonymous",
      rating,
      comment: comment || "",
    });

    const saved = await review.save();
    return res.json(saved);
  } catch (err) {
    console.error("REVIEW SAVE ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

/* ===============================
   GET REVIEWS BY PRODUCT
================================ */
router.get("/product/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
    }).sort({ createdAt: -1 });

    return res.json(reviews);
  } catch (err) {
    console.error("FETCH REVIEWS ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
