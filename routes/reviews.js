const express = require("express");
const Review = require("../models/Review");

const router = express.Router();

/* ===============================
   CREATE REVIEW
================================ */
router.post("/", async (req, res) => {
  try {
    const { productId, userId, userName, rating, comment } = req.body;

    if (!productId || !rating || !comment || !userName) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const review = new Review({
      productId,
      userId: userId || null,
      userName,
      rating,
      comment,
    });

    const saved = await review.save();
    res.json(saved);
  } catch (error) {
  console.error("❌ Review save error:", error);
  res.status(500).json({
    msg: "Server error",
    error: error.message
  });
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

    res.json(reviews);
  } catch (err) {
    console.error("FETCH REVIEWS ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
