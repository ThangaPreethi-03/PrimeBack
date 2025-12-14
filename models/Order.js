const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  img: { type: String }
});

const OrderSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    email: { type: String, required: true },

    items: {
      type: [OrderItemSchema],
      required: true
    },

    total: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Placed", "Packed", "Shipped", "Delivered", "Cancelled"],
      default: "Placed"
    },

    meta: { type: Object }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
