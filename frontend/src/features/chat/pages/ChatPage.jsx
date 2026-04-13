import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getMessages, sendMessage } from "../chatService";

function ChatPage() {
  const { matchId } = useParams();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      const data = await getMessages(matchId);
      setMessages(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;

    const newMsg = text;
    setText("");

    try {
      await sendMessage(matchId, newMsg);
      loadMessages();
    } catch (err) {
      console.log(err);
    }
  };

  const myId = localStorage.getItem("userId");

  return (
    <div style={container}>
      {/* 🔹 HEADER */}
      <div style={header}>
        <h3>Chat</h3>
      </div>

      {/* 🔹 CHAT AREA */}
      <div style={chatBox}>
        {messages.map((msg) => {
          const isMe = msg.sender._id === myId;

          return (
            <div
              key={msg._id}
              style={{
                ...messageWrapper,
                justifyContent: isMe ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...bubble,
                  background: isMe ? "#4CAF50" : "#f1f1f1",
                  color: isMe ? "#fff" : "#000",
                  borderRadius: isMe
                    ? "12px 12px 0 12px"
                    : "12px 12px 12px 0",
                }}
              >
                {/* NAME */}
                <div style={name}>
                  {isMe ? "You" : msg.sender.name}
                </div>

                {/* MESSAGE */}
                <div style={textStyle}>{msg.text}</div>

                {/* TIME */}
                <div style={time}>
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* 🔹 INPUT */}
      <div style={inputBar}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={input}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <button
          onClick={handleSend}
          disabled={!text.trim()}
          style={{
            ...sendBtn,
            opacity: text.trim() ? 1 : 0.5,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

/* 🔥 STYLES */

const container = {
  display: "flex",
  flexDirection: "column",
  height: "90vh",
  maxWidth: "800px",
  margin: "auto",
  border: "1px solid #ddd",
  borderRadius: "10px",
  overflow: "hidden",
};

const header = {
  padding: "15px",
  borderBottom: "1px solid #eee",
  background: "#fafafa",
};

const chatBox = {
  flex: 1,
  overflowY: "auto",
  padding: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  background: "#f9f9f9",
};

const messageWrapper = {
  display: "flex",
};

const bubble = {
  maxWidth: "60%",
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};

const name = {
  fontSize: "11px",
  fontWeight: "bold",
  marginBottom: "2px",
};

const textStyle = {
  fontSize: "14px",
  marginBottom: "4px",
};

const time = {
  fontSize: "10px",
  textAlign: "right",
  opacity: 0.7,
};

const inputBar = {
  display: "flex",
  gap: "10px",
  padding: "10px",
  borderTop: "1px solid #eee",
  background: "#fff",
};

const input = {
  flex: 1,
  padding: "10px",
  borderRadius: "20px",
  border: "1px solid #ccc",
  outline: "none",
};

const sendBtn = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "20px",
  background: "#4CAF50",
  color: "#fff",
  cursor: "pointer",
};

export default ChatPage;