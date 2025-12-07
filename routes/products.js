const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

/* GET ALL PRODUCTS */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* GET SINGLE PRODUCT — works with both id and _id */
router.get("/:id", async (req, res) => {
  try {
    const param = req.params.id;

    // Try numeric id first
    let product = null;

    if (!isNaN(Number(param))) {
      product = await Product.findOne({ id: Number(param) });
    }

    // If not found → try MongoDB _id
    if (!product) {
      product = await Product.findById(param);
    }

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
