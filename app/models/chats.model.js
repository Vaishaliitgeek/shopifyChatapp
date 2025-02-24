import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true }, 
  message: { type: String },  
  file: { type: String },  

  timestamp: { type: Date, default: Date.now } 
});

const chatSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  supportId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  messages: [messageSchema] 
});

export const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
