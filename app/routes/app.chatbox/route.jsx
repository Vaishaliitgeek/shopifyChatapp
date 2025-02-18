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



import { useEffect, useState } from "react";
import { Form, useLocation, useNavigate } from "@remix-run/react";
import { TextField, Button,Icon } from "@shopify/polaris";
import { Card } from "@shopify/polaris";
import { Page } from "@shopify/polaris";
import { Layout } from "@shopify/polaris";

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, seterror] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const userId = location.state

  const handleChats = async () => {
    try {
      let res;
     if (userId) {
         res = await fetch("/api/chats",{
          method: "POST",
          body: JSON.stringify({ userId }),
        })
      } else {
         res = await fetch("/api/chats");
      }
      const data = await res.json();
      const chatss = data.chats
      if (chatss.length == "0") {
        navigate('/app/customerlist')
      }
      if (chatss.length > "0") {
        setChats(chatss);
      setLoading(false)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const handleSend = async () => { 
    seterror("")
    if (!message.trim()) {
      seterror("pleace etner message")
    } else {
      try {
        const res = await fetch(`/api/chats`, {
          method: "PUT",
          body: JSON.stringify({ message,userId }),
        })
        setMessage("");
        handleChats();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }

  };

  const handleDeleteMessage = async (chatId, messageId) => {
    try {
      const res = await fetch(`/api/delete-message/${chatId}/${messageId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        handleChats(); 
      } else {
        console.error("Error deleting message:", data.message);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleRefresh = ()=>{
    handleChats();
  }

  useEffect(() => {
    handleChats();
  }, []);

  if (loading) {
    return <div>Loading ...</div>;
  }
  return (
    <div>
      <h1>Chat with Customer</h1>
      <Page title="Chat Application">
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <div
                style={{ height: "60vh", overflowY: "auto", padding: "10px" , backgroundColor:"#ffcbb8"}}
              >
                {chats.map((chat) => (
                  <li key={chat._id} style={{listStyle:"none"}}>
                    <ul style={{listStyle:"none"}}>
                      {chat.messages.map((item) => (
                        <li
                          key={item._id}
                          style={{
                            maxWidth: "96%",
                            display:"flex",
                            alignItems:"center",
                            justifyContent: item.sender == "support" ? "start" : "end"
                          }}
                        >
                         <p style={{ backgroundColor:
                              item.sender === "support" ? "#007ace" : "#5c5f62",
                              marginBottom: "8px",
                              padding: "8px",
                              borderRadius: "8px",
                              color: "white",}}>{item.message}</p>
                              
                                <Button
                                onClick={() => handleDeleteMessage(chat._id, item._id)} style={{ fontSize: "16px", padding:"0" }}
                              > <span style={{ fontSize: "16px", padding:"0px" }}>🗑️</span> </Button>
                               
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </div>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card sectioned>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <TextField
                  label="Enter your message"
                  value={message}
                  onChange={(value) => setMessage(value)}
                  fullWidth
                /> 
                {error && <p style={{color:"red"}}>{error}</p>}
                <Button primary onClick={handleSend}>Send</Button>
                <Button onClick={handleRefresh}>Refresh</Button>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </div>
  );
}

