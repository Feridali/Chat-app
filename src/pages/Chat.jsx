import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import SideNav from "./SideNav";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [decodedJwt, setDecodedJwt] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const avatar = localStorage.getItem("avatar");
  const username = localStorage.getItem("username");

  // Dummy-meddelanden
  const [fakeChat] = useState([
    {
      text: "Tja, hur mår du?",
      avatar: "https://i.pravatar.cc/100",
      username: "Jane",
      conversationId: null,
    },
    {
      text: "Hallå!! Svara då!!",
      avatar: "https://i.pravatar.cc/100",
      username: "Jane",
      conversationId: null,
    },
  ]);

  useEffect(() => {
    const decodedJwt = JSON.parse(atob(token.split(".")[1]));
    localStorage.setItem("decodedJwt", decodedJwt);
    setDecodedJwt(decodedJwt);
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    // Hämta meddelanden om token finns
    fetch(`${import.meta.env.VITE_BASE_URL}/messages`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch messages");
        }
        return res.json();
      })
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
        navigate("/");
      });
  }, [token, navigate]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      // Sanera meddelandet innan det skickas
      const sanitizedMessage = DOMPurify.sanitize(newMessage);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              text: sanitizedMessage,
              conversationId: null,
              username: username,
              avatar: avatar,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();
        setMessages([...messages, { ...data.latestMessage, username, avatar }]);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!messageId) {
      console.error("Message ID is undefined");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/messages/${messageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }

      setMessages(messages.filter((msg) => msg.id !== messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="chatPage">
      <SideNav />
      <div className="chatContainer">
        <div className="chatWrapper">
          <div className="chatHeader">
            <span>Welcome to the Chat Room</span>
          </div>
          <div className="chatMessages">
            {fakeChat.map((msg, index) => (
              <div className="message other" key={index}>
                <img src={msg.avatar} alt="avatar" className="avatar" />
                <div className="messageContent">
                  <strong>{msg.username}</strong>

                  <p>{DOMPurify.sanitize(msg.text)}</p>
                </div>
              </div>
            ))}
            {messages.map((msg) => (
              <div className="message self" key={msg.id}>
                <div className="messageContent">
                  <strong>{decodedJwt.user}</strong>

                  <p>{DOMPurify.sanitize(msg.text)}</p>
                  <button onClick={() => handleDeleteMessage(msg.id)}>
                    Delete
                  </button>
                </div>
                <img src={decodedJwt.avatar} alt="avatar" className="avatar" />
              </div>
            ))}
          </div>
          <div className="chatInputWrapper">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
