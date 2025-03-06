import { authenticate } from "../../shopify.server";
// import { User } from "../../models/user.model";
// import { Chat } from "../../models/chats.model";
import { User } from "../../server/models/user.model";
import { Chat } from "../../server/models/chats.model";

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    const shop = session.shop;
    if (!shop) {
      return Response.json({ message: "shop is not found", status: 400 });
    }
    let user = await User.findOne({ email: shop });
    if (!user) {
      return Response.json({ shopEmail: shop });
    }
    if (user) {
      if (user.customer_email) {
        return Response.json({
          message: "customer email is found",
          status: 200,
        });
      } else {
        return Response.json({ shopEmail: shop });
      }
    }
  } catch (error) {
    console.error("Error in loader:", error);
    return Response.json(
      { error: "Failed to fetch shop details" },
      { status: 500 },
    );
  }
};

export const action = async ({ request }) => {
  try {
    if (request.method === "POST") {
      const { customerEmail, role } = await request.json();
      console.log("customerEmail--", customerEmail);
      console.log("role--", role);

      if (!customerEmail) {
        return Response.json({ message: "Email is required", status: 400 });
      }

      const { admin, session } = await authenticate.admin(request);
      const shop = await admin.rest.resources.Shop.all({ session });
      const shopData = shop.data[0];
      console.log("shopData--", shopData);
      let user = await User.findOne({ email: session.shop });

      const existingCustomer = await User.findOne({ customer_email: customerEmail });
      if (existingCustomer) {
        return Response.json({ message: "This customer email already exists", status: 400 });
      }

      const existingSupport = await User.findOne({ role: "support" });

      if (existingSupport && role === "support") {
        return Response.json({ message: "A support user already exists", status: 400 });
      }

      if (!user) {
        user = new User({
          name: shopData.name,
          email: session.shop,
          customer_email: customerEmail,
          storeid: shopData.id,
          role: role,
        });
        await user.save();

        if (role === "customer") {
          const message = new Chat({
            customerId: user._id,
            messages: {
              sender: "support",
              message: "Hello",
            },
          });
          await message.save();
        }

        return Response.json({
          message: "User registered successfully",
          status: 200,
        });
      }

      if (user) {
        
        if (role === "support" && existingSupport) {
          return Response.json({ message: "A support user already exists", status: 400 });
        }

        user.customer_email = customerEmail;
        user.role = role;
        await user.save();

        return Response.json({
          message: "User updated successfully",
          status: 200,
        });
      }
    }
  } catch (error) {
    console.log("error---", error);
    return Response.json({ error: "Failed to fetch shop details" }, { status: 500 });
  }
};

