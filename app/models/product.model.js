import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productId:{type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  vendor: { type: String },
  status: { type: String, enum: ["ACTIVE", "DRAFT"], default: "DRAFT" },
  handle: { type: String, required: true, unique: true },
  // featuredImage: {
  //   url: { type: String },
  //   altText: { type: String }
  // },
  // storeid: { type: String, required: true }, 
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
