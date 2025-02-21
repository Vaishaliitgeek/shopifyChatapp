// import { createServer } from "http";
// import { Server } from "socket.io";
// import express from "express";
// import { Chat } from "./app/models/chats.model.js";


// const app = express();
// const server = createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "*", 
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("sendMessage", async (data) => {
//     const { userId, message, sender } = data;

//     try {
//       let chat = await Chat.findOne({ customerId: userId });
//       if (!chat) {
//         chat = new Chat({ customerId: userId, messages: [] });
//       }

//       const newMessage = { sender, message };
//       chat.messages.push(newMessage);
//       await chat.save();

//       io.emit("receiveMessage", { chatId: chat._id, message: newMessage });
//     } catch (error) {
//       console.error("Error saving chat:", error);
//       socket.emit("error", { message: "Failed to send message" });
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// server.listen(4000, () => {
//   console.log("Socket.IO Server running on port 4000");
// });
