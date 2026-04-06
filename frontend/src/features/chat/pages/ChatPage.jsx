import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMessages, sendMessage } from "../chatService";

function ChatPage() {
  const { matchId } = useParams();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    loadMessages();

    // 🔁 auto refresh every 3 sec
    const interval = setInterval(loadMessages, 3000);

    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    const data = await getMessages(matchId);
    setMessages(data);
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    await sendMessage(matchId, text);
    setText("");
    loadMessages();
  };

  return (
    <div>
      <h2>Chat</h2>

      <div style={chatBox}>
        {messages.map((msg) => (
          <div
            key={msg._id}
            style={{
              ...messageStyle,
              alignSelf:
                msg.sender._id === localStorage.getItem("userId")
                  ? "flex-end"
                  : "flex-start",
              background:
                msg.sender._id === localStorage.getItem("userId")
                  ? "#4CAF50"
                  : "#eee",
              color:
                msg.sender._id === localStorage.getItem("userId")
                  ? "white"
                  : "black",
            }}
          >
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "10px" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

const chatBox = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  height: "400px",
  overflowY: "auto",
  border: "1px solid #ccc",
  padding: "10px",
};

const messageStyle = {
  maxWidth: "60%",
  padding: "10px",
  borderRadius: "10px",
};

export default ChatPage;