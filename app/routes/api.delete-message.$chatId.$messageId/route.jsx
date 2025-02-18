import { Chat } from "../../models/chats.model";
import { User } from "../../models/user.model";

export const action = async ({ request, params }) => {
  if (request.method !== "DELETE") {
    return Response.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
  }

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
};










