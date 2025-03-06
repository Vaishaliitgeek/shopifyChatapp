import mongoose from "mongoose";
import { type } from "os";

const shopLcp = new mongoose.Schema({
  payload:{
    type:JSON
  },
  
});


export const ShopLcp = mongoose.models.ShopLcp || mongoose.model("ShopLcp", shopLcp);
