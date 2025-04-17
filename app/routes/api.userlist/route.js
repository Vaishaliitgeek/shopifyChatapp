
import { authenticate } from "../../shopify.server";
import { Chat } from "../../server/models/chats.model";
import { User } from "../../server/models/user.model";
import { sendResponse } from "../../server/utils/sendResponse";
import { successMessage,errorMessage } from "../../server/constants/message";
import { statusCode } from "../../server/constants/constant";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  let user = await User.findOne({ email: shop });
  console.log('user', user);
  if (user.role == "support") {
    try {
      const users = await User.find({ role: "customer" });

       return sendResponse(statusCode.OK, successMessage.OPERATION_SUCCESS, true, users)
    } catch (error) {
      return sendResponse(statusCode.INTERNAL_SERVER_ERROR,errorMessage.INTERNAL_SERVER_ERROR,false,error)
    }
  } else {
    return sendResponse(statusCode.PERMISSION_DENIED,errorMessage.PERMISSION_DENIED,false)
  }

};