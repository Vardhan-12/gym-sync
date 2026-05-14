import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getMessages, sendMessage } from "../chatService";
import socket from "../../../services/socket";

function ChatPage() {
  // 🔹 matchId comes from route: /chat/:matchId
  const { matchId } = useParams();

  // 🔹 state
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 🔹 current user id (stored at login)
  const myId = localStorage.getItem("userId");

  // 🔹 for auto-scroll
  const bottomRef = useRef(null);

  // 🔹 to control typing debounce timer
  const typingTimeoutRef = useRef(null);

  /* ===================================================
     LOAD INITIAL DATA + SOCKET SUBSCRIPTIONS
     =================================================== */
  useEffect(() => {
    // reset pagination when match changes
    setPage(1);
    loadMessages(1);

    /* ===================================================
   JOIN CHAT ROOM
=================================================== */

const joinRoom = () => {

  console.log("Joining room:", matchId);

  socket.emit("joinRoom", matchId);

};

// if already connected
if (socket.connected) {
  joinRoom();
}

// if reconnect happens
socket.on("connect", joinRoom);

    /* ===================================================
   SOCKET EVENTS
=================================================== */

// receive new realtime message
const onReceiveMessage = (msg) => {

  console.log("🔥 Realtime message received:", msg);

  setMessages((prev) => {

    // duplicate prevention
    const exists = prev.some(
      (m) => m._id === msg._id
    );

    if (exists) {
      return prev;
    }

    return [...prev, msg];

  });

};

// typing indicators
const onTyping = () => setTyping(true);

const onStopTyping = () => setTyping(false);

// register listeners
socket.on("receiveMessage", onReceiveMessage);
socket.on("typing", onTyping);
socket.on("stopTyping", onStopTyping);

/* ===================================================
   CLEANUP
=================================================== */
return () => {
  socket.off("connect", joinRoom);
  socket.off("receiveMessage", onReceiveMessage);
  socket.off("typing", onTyping);
  socket.off("stopTyping", onStopTyping);
};

  }, [matchId]);

  /* ===================================================
     LOAD MESSAGES (WITH PAGINATION)
     Backend returns:
     { messages: [], hasMore: true/false }
     =================================================== */
  const loadMessages = async (pageNum = 1) => {
    try {
      // NOTE: your service should call:
      // GET /api/chat/:matchId?page=pageNum&limit=20
      const data = await getMessages(matchId, pageNum);

      if (pageNum === 1) {
        // first page → replace
        setMessages(data.messages || []);
      } else {
        // older messages → prepend
        setMessages((prev) => [...(data.messages || []), ...prev]);
      }

      setHasMore(Boolean(data.hasMore));
    } catch (err) {
      console.log("Load messages error:", err);
    }
  };

  /* ===================================================
     AUTO SCROLL TO BOTTOM WHEN NEW MESSAGE ARRIVES
     =================================================== */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 mark messages as read when opening chat
useEffect(() => {
  socket.emit("markAsRead", matchId);
}, [matchId]);

// 🔥 receive read updates
useEffect(() => {
  socket.on("messagesRead", () => {
    setMessages(prev =>
      prev.map(m => ({ ...m, isRead: true }))
    );
  });
}, []);

  /* ===================================================
     SEND MESSAGE
     - optimistic UI update
     - emit via socket
     - persist via API
     =================================================== */
  /* ===================================================
   SEND MESSAGE
=================================================== */
const handleSend = async () => {

  // prevent empty messages
  if (!text.trim()) return;

  try {

    // save current text
    const messageText = text.trim();

    // clear input immediately
    setText("");

    /* ===============================================
       1. SAVE MESSAGE IN DATABASE
    =============================================== */
    const savedMessage = await sendMessage(
      matchId,
      messageText
    );

    /* ===============================================
       2. ADD TO MY UI
    =============================================== */
    setMessages((prev) => [

      ...prev,

      {
        ...savedMessage,

        // IMPORTANT:
        // backend may return sender only as ID
        sender: {
          _id: myId,
          name: "You",
        },
      },

    ]);

    /* ===============================================
       3. SEND REALTIME EVENT
    =============================================== */
    socket.emit("sendMessage", {

      ...savedMessage,

      matchId,

      sender: {
        _id: myId,
        name: "You",
      },

    });

  } catch (error) {

    console.log("Send message error:", error);

  }

};

  /* ===================================================
     TYPING HANDLER (DEBOUNCED)
     =================================================== */
  const handleTyping = (e) => {
    const value = e.target.value;
    setText(value);

    // emit typing
    socket.emit("typing", matchId);

    // clear previous timer
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // stop typing after 800ms of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", matchId);
    }, 800);
  };

  /* ===================================================
     LOAD OLDER MESSAGES (BUTTON)
     =================================================== */
  const loadOlder = () => {
    const next = page + 1;
    setPage(next);
    loadMessages(next);
  };

  /* ===================================================
     UI
     =================================================== */
  return (
    <div style={container}>
      {/* HEADER */}
      <div style={header}>
        <h3 style={{ margin: 0 }}>Chat</h3>
      </div>

      {/* CHAT AREA */}
      <div style={chatBox}>
        {/* LOAD MORE */}
        {hasMore && (
          <button onClick={loadOlder} style={loadMoreBtn}>
            Load Older Messages
          </button>
        )}

        {/* MESSAGES */}
        {messages.map((msg) => {
          const isMe = String(msg.sender._id) === String(myId);

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
                <div style={name}>
                  {isMe ? "You" : msg.sender?.name}
                </div>

                <div style={textStyle}>{msg.text}</div>

                <div style={time}>
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}

        {/* TYPING */}
        {typing && <p style={typingStyle}>Typing...</p>}

        {/* SCROLL ANCHOR */}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div style={inputBar}>
        <input
          value={text}
          onChange={handleTyping}
          placeholder="Type a message..."
          style={input}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <button onClick={handleSend} style={sendBtn}>
          Send
        </button>
      </div>
    </div>
  );
}

/* ================== STYLES ================== */

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

const loadMoreBtn = {
  alignSelf: "center",
  padding: "6px 10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  cursor: "pointer",
  background: "#fff",
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

const typingStyle = {
  fontSize: "12px",
  color: "gray",
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