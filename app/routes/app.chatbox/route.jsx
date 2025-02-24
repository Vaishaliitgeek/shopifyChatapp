// import { useState,useEffect } from "react";
// import { Card } from "@shopify/polaris";
// import { Button } from "@shopify/polaris";
// import { TextField } from "@shopify/polaris";
// import { Page } from "@shopify/polaris";
// import { Layout } from "@shopify/polaris";

// export default function ChatApp() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//     useEffect(() => {

//       const handleChats = async () => {
//         try {
//           const res = await fetch("/api/chats")
//           const data = await res.json();
//           console.log(data)
//         } catch (error) {
//           console.error("Error fetching data:", error);
//         }
//       };

//       handleChats()
//     }, [])

//   const sendMessage = () => {
//     if (input.trim() === "") return;
//     setMessages([...messages, { text: input, sender: "You" }]);
//     setInput("");
//   };

//   return (
//     <Page title="Chat Application">
//       <Layout>
//         <Layout.Section>
//           <Card sectioned>
//             <div style={{ height: "60vh", overflowY: "auto", padding: "10px" }}>
//               {messages.map((msg, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     marginBottom: "8px",
//                     padding: "8px",
//                     borderRadius: "8px",
//                     color: "white",
//                     maxWidth: "80%",
//                     backgroundColor: msg.sender === "" ? "#007ace" : "#5c5f62",
//                     alignSelf: msg.sender === "You" ? "flex-end" : "flex-start",
//                   }}
//                 >
//                   {msg.text}
//                 </div>
//               ))}
//             </div>
//           </Card>
//         </Layout.Section>
//         <Layout.Section>
//           <Card sectioned>
//             <div style={{ display: "flex", gap: "10px" }}>
//               <TextField
//                 label="Message"
//                 value={input}
//                 onChange={(value) => setInput(value)}
//                 autoComplete="off"
//               />
//               <Button primary onClick={sendMessage}>
//                 Send
//               </Button>
//             </div>
//           </Card>
//         </Layout.Section>
//       </Layout>
//     </Page>
//   );
// }



// import { useEffect, useState } from "react";
// import { Form, useLocation, useNavigate } from "@remix-run/react";
// import { TextField, Button, Icon } from "@shopify/polaris";
// import { Card } from "@shopify/polaris";
// import { Page } from "@shopify/polaris";
// import { Layout } from "@shopify/polaris";

// export default function Chat() {
//   const [chats, setChats] = useState([]);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, seterror] = useState("");
//   const [editContent, setEditContent] = useState({
//     chatId: "",
//     messageId: "",
//     newMessage: "",
//   });
//   const navigate = useNavigate();
//   const location = useLocation();
//   const userId = location.state;

//   const handleChats = async () => {
//     try {
//       let res;
//       if (userId) {
//         res = await fetch("/api/chats", {
//           method: "POST",
//           body: JSON.stringify({ userId }),
//         });
//       } else {
//         res = await fetch("/api/chats");
//       }
//       const data = await res.json();
//       const chatss = data.chats;
//       if (chatss.length == "0") {
//         navigate("/app/customerlist");
//       }
//       if (chatss.length > "0") {
//         setChats(chatss);
//         setLoading(false);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleSend = async () => {
//     seterror("");
//     if (!message.trim()) {
//       seterror("pleace etner message");
//     } else {
//       try {
//         const res = await fetch(`/api/chats`, {
//           method: "PUT",
//           body: JSON.stringify({ message, userId }),
//         });
//         setMessage("");
//         handleChats();
//       } catch (error) {
//         console.error("Error sending message:", error);
//       }
//     }
//   };

//   const handleDeleteMessage = async (chatId, messageId) => {
//     try {
//       const res = await fetch(`/api/edit-message/${chatId}/${messageId}`, {
//         method: "DELETE",
//       });
//       const data = await res.json();
//       if (data.success) {
//         handleChats();
//       } else {
//         console.error("Error deleting message:", data.message);
//       }
//     } catch (error) {
//       console.error("Error deleting message:", error);
//     }
//   };

//   const handleEdit = async (chatId, messageId, newMessage) => {
//     try {
//       const res = await fetch(`/api/edit-message/${chatId}/${messageId}`, {
//         method: "PUT",
//         body: JSON.stringify({ newMessage }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await res.json();
//       if (data.success) {
//         setEditContent({
//           chatId: "",
//           messageId: "",
//           newMessage: "",
//         });
//         handleChats();
//       } else {
//         console.error("Error updating message:", data.message);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const handleRefresh = () => {
//     handleChats();
//   };

//   useEffect(() => {
//     handleChats();
//   }, []);

//   if (loading) {
//     return <div>Loading ...</div>;
//   }
//   return (
//     <div>
//       <h1>Chat with Customer</h1>
//       <Page title="Chat Application">
//         <Layout>
//           <Layout.Section>
//             <Card sectioned>
//               <div
//                 style={{
//                   height: "60vh",
//                   overflowY: "auto",
//                   padding: "10px",
//                   backgroundColor: "#ffcbb8",
//                 }}
//               >
//                 {chats.map((chat) => (
//                   <li key={chat._id} style={{ listStyle: "none" }}>
//                     <ul style={{ listStyle: "none" }}>
//                       {chat.messages.map((item) => (
//                         <li
//                           key={item._id}
//                           style={{
//                             maxWidth: "96%",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent:
//                               item.sender == "support" ? "start" : "end",
//                           }}
//                         >
//                           <p
//                             style={{
//                               backgroundColor:
//                                 item.sender === "support"
//                                   ? "#007ace"
//                                   : "#5c5f62",
//                               marginBottom: "8px",
//                               padding: "8px",
//                               borderRadius: "8px",
//                               color: "white",
//                             }}
//                           >
//                             {item.message}
//                           </p>
//                           {item.sender === "customer" && (
//                             <>
//                               <Button
//                                 onClick={() =>
//                                   handleDeleteMessage(chat._id, item._id)
//                                 }
//                                 style={{ fontSize: "16px", padding: "0" }}
//                               >
//                                 {" "}
//                                 <span
//                                   style={{ fontSize: "16px", padding: "0px" }}
//                                 >
//                                   🗑️
//                                 </span>{" "}
//                               </Button>
//                               <Button
//                                 onClick={() =>
//                                   setEditContent({
//                                     ...editContent,
//                                     chatId: chat._id,
//                                     messageId: item._id,
//                                     newMessage: item.message,
//                                   })
//                                 }
//                               >
//                                 Edit
//                               </Button>
//                             </>
//                           )}
//                         </li>
//                       ))}
//                     </ul>
//                   </li>
//                 ))}
//               </div>
//             </Card>
//           </Layout.Section>
//           <Layout.Section>
//             <Card sectioned>
//               <div
//                 style={{ display: "flex", gap: "10px", alignItems: "center" }}
//               >
//                 {editContent.chatId ? (
//                   <>
//                     <TextField
//                       label="Enter your message"
//                       value={editContent.newMessage}
//                       onChange={(value) =>
//                         setEditContent({ ...editContent, newMessage: value })
//                       }
//                       fullWidth
//                     />
//                     <Button
//                       primary
//                       onClick={() =>
//                         handleEdit(
//                           editContent.chatId,
//                           editContent.messageId,
//                           editContent.newMessage,
//                         )
//                       }
//                     >
//                       edit
//                     </Button>
//                   </>
//                 ) : (
//                   <>
//                     {" "}
//                     <TextField
//                       label="Enter your message"
//                       value={message}
//                       onChange={(value) => setMessage(value)}
//                       fullWidth
//                     />
//                     <Button primary onClick={handleSend}>
//                       Send
//                     </Button>
//                   </>
//                 )}

//                 <Button onClick={handleRefresh}>Refresh</Button>
//               </div>
//             </Card>
//           </Layout.Section>
//         </Layout>
//       </Page>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { useLocation } from "@remix-run/react";
import { TextField, Button, Card, Page, Layout } from "@shopify/polaris";
import { io } from "socket.io-client";

const socket = io("https://ace3-49-249-2-6.ngrok-free.app", {
  transports: ["websocket"],
  secure: true,
});

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [typingMessage, setTypingMessage] = useState("");
  const location = useLocation();
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("support");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const userIds = location.state;
    if (userIds) {
      setUserId(userIds);
    } else {
      handleChats();
    }
  }, [location.state]);

  useEffect(() => {
    if (userId) {
      handleChats();
      socket.emit("joinChat", userId);
    }

    socket.on("newMessage", (newChat) => {
      setChats(newChat);
    });

    socket.on("user2Typing", ({ userId, role }) => {
      console.log(userId, "is typing...");
      setTypingMessage(` is typing...`);
      setTimeout(() => setTypingMessage(""), 2000);
    });

    return () => {
      socket.off("newMessage");
      socket.off("user2Typing");
    };
  }, [userId]);
  const handleChats = async () => {
    try {
      let res = userId
        ? await fetch("/api/chats", {
            method: "POST",
            body: JSON.stringify({ userId }),
            headers: { "Content-Type": "application/json" },
          })
        : await fetch("/api/chats");

      const data = await res.json();
      setChats(data.chats);
      if (data.userId) {
        setUserId(data.userId);
        setRole(data.role);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleTyping = () => {
    socket.emit("typing", { userId, role });
  };

  const handleSend = async () => {
    if (!message.trim() && !selectedFile) return;  
//
    let fileUrl = "";
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", "chatImage"); 

      const response = await fetch("https://api.cloudinary.com/v1_1/dxhnwndac/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      fileUrl = data.secure_url; 
    }

    socket.emit("sendMessage", { userId, message, file: fileUrl, role });

    setMessage("");
    setSelectedFile(null);
    setPreviewUrl(null);

  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <Page title="Chat with Customer">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <div
              style={{ height: "60vh", overflowY: "auto", padding: "10px", backgroundColor: "#ffcbb8" }}
            >
              {chats.map((chat, index) => (
                <li key={index} style={{ listStyle: "none" }}>
                  <ul style={{ listStyle: "none" }}>
                  {chat.messages.map((item, msgIndex) => (
                      <li key={msgIndex} style={{ display: "flex", justifyContent: item.sender === "support" ? "start" : "end",flexDirection:"column", alignItems: item.sender === "support" ? "start" : "end"}}>
                        <div style={{display:"block"}}>
                        {item.file ? (
                          <img src={item.file} alt="Uploaded" style={{ maxWidth: "200px", borderRadius: "5px" }} />
                        ) : null}
                        </div>
                        
                        {item.message ? (
                          <p
                            style={{
                              backgroundColor: item.sender === "support" ? "#007ace" : "#5c5f62",
                              marginBottom: "8px",
                              padding: "8px",
                              borderRadius: "8px",
                              color: "white",
                            }}
                          >
                            {item.message}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </div>
            {typingMessage && <p style={{ padding: "10px", fontStyle: "italic" }}>{typingMessage}</p>}
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card sectioned>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <TextField label="Enter your message" value={message} onChange={(value) => { setMessage(value); handleTyping(); }} fullWidth />
              {/* <input type="file" accept="image/*" onChange={handleImageChange} /> */}
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <Button primary onClick={handleSend}>Send</Button>
            </div>
            {previewUrl && ( 
              <div style={{ marginTop: "10px", textAlign: "center" }}>
                <p>Image Preview:</p>
                <img src={previewUrl} alt="Preview" style={{ maxWidth: "200px", borderRadius: "5px" }} />
              </div>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
