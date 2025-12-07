const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  img: String,
  description: String,
  stock: { type: Number, default: 10 }
});
module.exports = mongoose.model('Product', ProductSchema);
