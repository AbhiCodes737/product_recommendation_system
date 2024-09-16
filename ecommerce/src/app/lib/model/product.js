import mongoose from "mongoose";

const productModel = new mongoose.Schema({
  pid: String,
  product_name: String,
  product_category_tree: String,
  retail_price: Number,
  discounted_price: Number,
  image: [String],
  description: String,
  brand: String,
  product_specifications: String,
  section: String,
  category: String,
  subcategory1: String,
  subcategory2: String,
  subcategory3: String,
});

export const Product = mongoose.models.products || mongoose.model("products", productModel)
