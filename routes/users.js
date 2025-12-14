const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");

/* ===============================
   GET USER WISHLIST
================================ */
router.get("/:id/wishlist", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json([]);
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.json([]);

    res.json(user.wishlist || []);
  } catch (err) {
    console.error("Wishlist GET error:", err);
    res.status(500).json([]);
  }
});

/* ===============================
   TOGGLE WISHLIST
================================ */
router.post("/:id/wishlist", async (req, res) => {
  const { id } = req.params;
  const { productId } = req.body;

  console.log("WISHLIST HIT", { id, productId });

  // 🔴 HARD VALIDATION
  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(productId)
  ) {
    return res
      .status(400)
      .json({ error: "Invalid userId or productId" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const pid = String(productId);

    const index = user.wishlist.findIndex(
      (w) => String(w.productId) === pid
    );

    if (index === -1) {
      // 🔍 VERIFY PRODUCT EXISTS
      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ error: "Product not found in DB" });
      }

      user.wishlist.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        img: product.img,
      });
    } else {
      user.wishlist.splice(index, 1);
    }

    await user.save();
    res.json(user.wishlist);
  } catch (err) {
    console.error("Wishlist TOGGLE error:", err);
    res.status(500).json({ error: "Wishlist update failed" });
  }
});

module.exports = router;
