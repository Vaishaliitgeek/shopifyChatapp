

// import { Chat } from "../../models/chats.model";
import { Chat } from "../../server/models/chats.model";

export const action = async ({ request, params }) => {
  const method = request.method;

  if (method === "DELETE") {
    // DELETE Request - Message Delete Logic
    try {
      const { chatId, messageId } = params; 
      const result = await Chat.updateOne(
        { _id: chatId },
        { $pull: { messages: { _id: messageId } } }
      );

      if (result.modifiedCount > 0) {
        return Response.json({ success: true, message: "Message deleted successfully" });
      } else {
        return Response.json({ success: false, message: "Message not found" }, { status: 404 });
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      return Response.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
  } else if (method === "PUT") {
    try {
      const { chatId, messageId } = params;
      const { newMessage } = await request.json(); 
      console.log("put edit valaa",chatId, messageId, newMessage);

      const result = await Chat.updateOne(
        { _id: chatId, "messages._id": messageId },
        { $set: { "messages.$.message": newMessage } }
      );

      if (result.modifiedCount > 0) {
        return Response.json({ success: true, message: "Message updated successfully" });
      } else {
        return Response.json({ success: false, message: "Message not found or no changes made" }, { status: 404 });
      }
    } catch (error) {
      console.error("Error updating message:", error);
      return Response.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
  } else {
    return Response.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
  }
};






