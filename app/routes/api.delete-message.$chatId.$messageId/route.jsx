import { statusCode } from "../../server/constants/constant";
import { successMessage,errorMessage } from "../../server/constants/message";
import { Chat } from "../../server/models/chats.model";
import { User } from "../../server/models/user.model";

export const action = async ({ request, params }) => {
  if (request.method !== "DELETE") {
    return Response.json({ success:statusCode.FORBIDDEN, message: errorMessage.INVALID_REQUEST }, { status: statusCode.FORBIDDEN });
  }

  try {
    const { chatId, messageId } = params;
    const result = await Chat.updateOne(
      { _id: chatId },
      { $pull: { messages: { _id: messageId } } }
    );

    if (result.modifiedCount > 0) {
      return Response.json({ status:statusCode.OK,success: true, message: "Message deleted successfully" });
    } else {
      return Response.json({ success: false, message: "Message not found" }, { status: statusCode.NOT_FOUND });
    }
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json({ success: false, message: errorMessage.INTERNAL_SERVER_ERROR }, { status: statusCode.INTERNAL_SERVER_ERROR });
  }
};










