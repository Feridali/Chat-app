import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [updatedAvatar, setUpdatedAvatar] = useState("");
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

  // Funktion för att skicka ett nytt meddelande
  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
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
              text: newMessage,
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

  // Funktion för att radera ett meddelande
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

      // Ta bort meddelandet från state
      setMessages(messages.filter((msg) => msg.id !== messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  // Funktion för att uppdatera användaruppgifter
  const handleUpdateUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/${username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: updatedUsername,
            avatar: updatedAvatar,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const data = await response.json();
      // Uppdatera användaruppgifter i localStorage och state
      localStorage.setItem("username", data.username);
      localStorage.setItem("avatar", data.avatar);
      setUpdatedUsername(data.username);
      setUpdatedAvatar(data.avatar);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("avatar");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="chatContainer">
      <div className="chatWrapper">
        <div className="chatHeader">
          <span>Welcome to the Chat Room</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div className="chatMessages">
          {fakeChat.map((msg, index) => (
            <div className="message other" key={index}>
              <img src={msg.avatar} alt="avatar" className="avatar" />
              <div className="messageContent">
                <strong>{msg.username}</strong>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {messages.map((msg) => (
            <div className="message self" key={msg.id}>
              <div className="messageContent">
                <strong>{username}</strong>
                <p>{msg.text}</p>
                <button onClick={() => handleDeleteMessage(msg.id)}>
                  Delete
                </button>
              </div>
              <img src={avatar} alt="avatar" className="avatar" />
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
        <div className="updateUserWrapper">
          <input
            type="text"
            placeholder="Update username..."
            value={updatedUsername}
            onChange={(e) => setUpdatedUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Update avatar URL..."
            value={updatedAvatar}
            onChange={(e) => setUpdatedAvatar(e.target.value)}
          />
          <button onClick={handleUpdateUser}>Update User</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
