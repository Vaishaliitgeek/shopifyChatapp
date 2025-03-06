import mongoose from "mongoose";
import { type } from "os";

const flowSchema = new mongoose.Schema({
  payload:{
    type:JSON
  },
  
});


export const Flow = mongoose.models.Flow || mongoose.model("Flow", flowSchema);
