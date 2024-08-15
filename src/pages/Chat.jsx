import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importera useNavigate för att omdirigera

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate(); // Använd useNavigate för navigering

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const newMsg = { id: messages.length + 1, text: newMessage };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  const handleLogout = () => {
    // Radera token och användardata från localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Omdirigera användaren till inloggningssidan
    navigate("/");
  };

  return (
    <div className="chatContainer">
      <div className="chatWrapper">
        <div className="chatHeader">
          <span>Welcome to the Chat Room</span>
          <button onClick={handleLogout}>Logout</button>{" "}
          {/* Lägg till en utloggningsknapp */}
        </div>
        <div className="chatMessages">
          {messages.map((msg) => (
            <div key={msg.id}>{msg.text}</div>
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
  );
}

export default Chat;
