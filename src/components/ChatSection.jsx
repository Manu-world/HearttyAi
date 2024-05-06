// ChatSection.js

import React, { useState, useEffect } from "react";
import axios from "axios";

function ChatSection({ userEmail, latestResult }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch initial conversation history
    fetchConversationHistory(userEmail);
  }, [userEmail]);

  const fetchConversationHistory = async (email) => {
    try {
      const response = await axios.get(`/result/${email}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Failed to fetch conversation history:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const message = { text: newMessage, session_id: userEmail };
    setNewMessage("");
    try {
      const response = await axios.post("/chat", {
        text: newMessage,
        session_id: userEmail,
        context: latestResult,
      });
      setMessages([...messages, response.data]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div>
      <div className="chat-history">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${
              message.session_id === userEmail ? "sent" : ""
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" onClick={sendMessage}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatSection;
