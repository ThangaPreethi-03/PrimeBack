// prime-shop-backend/models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // recommended: attach ObjectId of user
    email: { type: String, required: true },
    items: [
      {
        name: String,
        price: Number,
        qty: Number,
        img: String,
        productId: { type: mongoose.Schema.Types.Mixed } // optional, may be numeric or ObjectId
      }
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Placed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Placed"
    },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
