import { useState } from "react";
import axios from "../../../services/axiosInstance";

/*
  SIMPLE CHATBOT UI
*/

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { type: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post("/ai/ask", {
        question: input,
      });

      const botMsg = { type: "bot", text: res.data.answer };

      setMessages((prev) => [...prev, botMsg]);
      setInput("");

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={container}>

      <h3>Gym AI Assistant</h3>

      <div style={chatBox}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.type === "user" ? "right" : "left",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                background: m.type === "user" ? "#4CAF50" : "#eee",
                padding: "8px",
                borderRadius: "10px",
                display: "inline-block",
              }}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>

      <div style={inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          style={inputStyle}
        />

        <button onClick={sendMessage}>Send</button>
      </div>

    </div>
  );
}

/* styles */
const container = {
  border: "1px solid #ddd",
  padding: "10px",
  borderRadius: "10px",
  maxWidth: "400px",
};

const chatBox = {
  height: "200px",
  overflowY: "auto",
  marginBottom: "10px",
};

const inputBox = {
  display: "flex",
  gap: "10px",
};

const inputStyle = {
  flex: 1,
};

export default Chatbot;