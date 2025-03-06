// import { Chat } from "../../models/chats.model";
// import { User } from "../../models/user.model";
import { authenticate } from "../../shopify.server";
import { Chat } from "../../server/models/chats.model";
import { User } from "../../server/models/user.model";

export const loader = async ({ request }) => {
    const { session } = await authenticate.admin(request);
    const shop = session.shop;
    let user = await User.findOne({ email: shop });
    console.log('user',user);
    if (user.role == "support") {
        try {
          const users = await User.find({ role: "customer" });
          

            return new Response(JSON.stringify({ message: "Fetch successful", users }), { status: 200 });
          } catch (error) {
            return new Response(JSON.stringify({ message: "Error fetching data", error: error.message }), { status: 500 });
          }
    } else {
        return new Response(JSON.stringify({ message: "Access Denied"}));
    }
  
};