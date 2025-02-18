

// import { Chat } from "../../models/chats.model";
// import { User } from "../../models/user.model";

// export const loader = async ({ request }) => {
//   const { userId } = params;
//   const customerId=userId;
//   console.log("loaderrrrr customer",userId)
//   try {
//     const chats = await Chat.find({customerId});
// console.log("chatsssss",chats)
//     if (!chats) {
//       return new Response(JSON.stringify({ message: "No chats found" }), { status: 404 });
//     }
//     return new Response(JSON.stringify({ message: "Chats fetched successfully", chats }), { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ message: "Error fetching chats", error: error.message }), { status: 500 });
//   }
// };

// export const action = async ({ request }) => {
//   const { userId } = params;
//   const body = await request.json();
// console.log("bodyyyy",body)

//   if (request.method === 'POST') {
//     try {

//       const user = await User.findById(userId);
//       if (!user) {
//         return Response.json({ error: "User not found" }, { status: 404 });
//       }

//       let chat = await Chat.findOne({ customerId: userId });

//       if (chat) {

//         chat.messages.push({
//           sender: user.role,
//           message: body.message,
//         });

//         await chat.save();
//         return Response.json({ message: "Message added to existing chat", chat });
//       } else {
//         chat = new Chat({
//           customerId: userId,

//           messages: [
//             {
//           sender: user.role,
//           // sender: body.role,
//               message: body.message,
//             },
//           ],
//         });

//         await chat.save();
//         return Response.json({ message: "New chat created", chat });
//       }
//     } catch (error) {
//       console.error("Error in action:", error);
//       return Response.json({ error: "Failed to process chat" }, { status: 500 });
//     }
//   } else {
//     return Response.json({ error: "Invalid method" }, { status: 405 });
//   }
// };
import { Chat } from "../../models/chats.model";
import { User } from "../../models/user.model";
import { authenticate } from "../../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  if (!shop) {
    return Response.json({ message: "shop is not found", status: 400 });
  }
  let user = await User.findOne({ email: shop });
  if (!user) {
    return Response.json({ message: "user is not found", status: 404 });
  }
  const customerId = user._id;

  try {
    const chats = await Chat.find({ customerId });
    console.log('chats',chats);
    if (!chats) {
      return Response.json({ message: "No chats found", status: 404  });
    }
    return Response.json({ chats , status : 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Error fetching chats", error: error.message }),
      { status: 500 },
    );
  }
};



export const action = async ({ request }) => {

     if (request.method == "POST") {
      const {userId} = await request.json();
      console.log('userid--',userId);
      const customerId = userId;
      try {
        const chats = await Chat.find({ customerId });
        console.log('chats',chats);
        if (!chats) {
          return Response.json({ message: "No chats found", status: 404  });
        }
        return Response.json({ chats , status : 200 });
      } catch (error) {
        console.error(error);
        return new Response(
          JSON.stringify({ message: "Error fetching chats", error: error.message }),
          { status: 500 },
        );
      }
     }  else{
      const { session } = await authenticate.admin(request);
      const shop = session.shop;
      if (!shop) {
        return Response.json({ message: "shop is not found", status: 400 });
      }
      let users = await User.findOne({ email: shop });
      if (!users) {
        return Response.json({ message: "user is not found", status: 404 });
      }
      let userId ;
      const body = await request.json();
      if (body.userId) {
        userId = body.userId
      } else {
        userId = users._id
      }

    if (request.method === "PUT") {
      try {
        const user = await User.findById(userId);
        if (!user) {
          return Response.json({ error: "User not found" }, { status: 404 });
        }
  
        let chat = await Chat.findOne({ customerId: userId });
  
        if (chat) {
          chat.messages.push({
            sender: users.role,
            message: body.message,
          });
  
          await chat.save();
          return Response.json({
            message: "Message added to existing chat",
            chat,
          });
        } else {
          chat = new Chat({
            customerId: userId,
  
            messages: [
              {
                sender: user.role,
                // sender: body.role,
                message: body.message,
              },
            ],
          });
  
          await chat.save();
          return Response.json({ message: "New chat created", chat });
        }
      } catch (error) {
        console.error("Error in action:", error);
        return Response.json(
          { error: "Failed to process chat" },
          { status: 500 },
        );
      }
    } else {
      return Response.json({ error: "Invalid method" }, { status: 405 });
    }
     }

};
