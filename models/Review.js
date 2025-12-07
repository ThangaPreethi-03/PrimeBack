// prime-shop-backend/models/Review.js
const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.Mixed, required: true }, // flexible: numeric id or ObjectId depending on your product model
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, default: "" },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
