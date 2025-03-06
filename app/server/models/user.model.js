import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  customer_email: { type: String, unique: true, sparse: true }, 
  storeid: { type: String, required: true }, 
  role: { type: String, default: "customer", enum: ["customer", "support"] } 
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
