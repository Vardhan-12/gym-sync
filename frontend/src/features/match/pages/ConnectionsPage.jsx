import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= SERVICES ================= */

// profile (requests + matches)
import {
  getMyMatches,
  getIncomingRequests,
  respondToRequest,
} from "../../profile/profileService";

// match (AI suggestions + send)
import {
  getSuggestions,
  sendRequest,
} from "../matchService";

/*
========================================================
 CONNECTIONS PAGE (CLEAN ARCHITECTURE)

 Tabs:
 1. Discover  → AI suggestions
 2. Matches   → accepted users
 3. Requests  → incoming requests

========================================================
*/

function ConnectionsPage() {

  /* ================= STATE ================= */

  const [activeTab, setActiveTab] = useState("discover");

  const [matches, setMatches] = useState([]);
  const [requests, setRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // 🔥 relation state (VERY IMPORTANT)
  const [statusMap, setStatusMap] = useState({});

  const navigate = useNavigate();
  const myId = localStorage.getItem("userId");

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [m, r, s] = await Promise.all([
        getMyMatches(),
        getIncomingRequests(),
        getSuggestions(),
      ]);

      setMatches(m || []);
      setRequests(r || []);
      setSuggestions(s || []);

      // 🔥 build relation map
      setStatusMap(buildStatusMap(m || [], r || []));

    } catch (err) {
      console.log("Load error:", err);
    }
  };

  /* ================= BUILD STATUS ================= */

  /*
    This decides what button to show
  */
  const buildStatusMap = (matches, requests) => {
    const map = {};

    // ✅ already connected
    matches.forEach((m) => {
      const other =
        m.requester._id === myId
          ? m.recipient._id
          : m.requester._id;

      map[other] = "connected";
    });

    // ✅ incoming request
    requests.forEach((r) => {
      map[r.requester._id] = "incoming";
    });

    return map;
  };

  /* ================= ACTIONS ================= */

  const handleSendRequest = async (userId) => {
    try {
      await sendRequest(userId);
      loadData(); // refresh UI
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleResponse = async (id, action) => {
    try {
      await respondToRequest(id, action);
      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  const openChat = (matchId) => {
    navigate(`/chat/${matchId}`);
  };

  /* ================= UI ================= */

  return (
    <div style={container}>

      <h1>Connections</h1>

      {/* ================= TABS ================= */}
      <div style={tabContainer}>
        <Tab label="Discover" active={activeTab} setTab={setActiveTab} value="discover" />
        <Tab label="Matches" active={activeTab} setTab={setActiveTab} value="matches" />
        <Tab label={`Requests (${requests.length})`} active={activeTab} setTab={setActiveTab} value="requests" />
      </div>

      {/* ================= DISCOVER ================= */}
      {activeTab === "discover" && (
        <div>

          {suggestions.length === 0 && <p>No suggestions yet</p>}

          {suggestions.map((item) => {

            const userId = item.user._id;
            const status = statusMap[userId];

            return (
              <div key={userId} style={card}>

                <div>
                  <p style={name}>{item.user.name}</p>

                  <p style={subText}>
                    Match Score: {item.totalScore}
                  </p>
                </div>

                {/* 🔥 SMART BUTTON */}
                {status === "connected" && (
                  <button disabled style={connectedBtn}>
                    Connected
                  </button>
                )}

                {status === "incoming" && (
                  <button
                    style={acceptBtn}
                    onClick={() => setActiveTab("requests")}
                  >
                    Accept
                  </button>
                )}

                {!status && (
                  <button onClick={() => handleSendRequest(userId)}>
                    Send Request
                  </button>
                )}

              </div>
            );
          })}

        </div>
      )}

      {/* ================= MATCHES ================= */}
      {activeTab === "matches" && (
        <div>

          {matches.length === 0 && <p>No matches yet</p>}

          {matches.map((match) => {

            const otherUser =
              match.requester._id === myId
                ? match.recipient
                : match.requester;

            return (
              <div key={match._id} style={card}>

                <div>
                  <p style={name}>{otherUser?.name}</p>

                  <p style={subText}>
                    {match.lastMessage
                      ? match.lastMessage.text
                      : "No messages yet"}
                  </p>
                </div>

                <button onClick={() => openChat(match._id)}>
                  Open Chat
                </button>

              </div>
            );
          })}

        </div>
      )}

      {/* ================= REQUESTS ================= */}
      {activeTab === "requests" && (
        <div>

          {requests.length === 0 && <p>No requests</p>}

          {requests.map((req) => (
            <div key={req._id} style={card}>

              <p style={name}>{req.requester?.name}</p>

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => handleResponse(req._id, "accepted")}>
                  Accept
                </button>

                <button onClick={() => handleResponse(req._id, "rejected")}>
                  Reject
                </button>
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

/* ================= REUSABLE TAB ================= */

function Tab({ label, value, active, setTab }) {
  return (
    <button
      onClick={() => setTab(value)}
      style={active === value ? activeTab : tab}
    >
      {label}
    </button>
  );
}

/* ================= STYLES ================= */

const container = {
  padding: "20px",
};

const tabContainer = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

const tab = {
  padding: "10px 15px",
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer",
  borderRadius: "6px",
};

const activeTab = {
  ...tab,
  background: "#4CAF50",
  color: "#fff",
};

const card = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  marginBottom: "10px",
  background: "#fafafa",
};

const name = {
  fontWeight: "bold",
};

const subText = {
  fontSize: "13px",
  color: "gray",
};

const connectedBtn = {
  background: "gray",
  color: "#fff",
  cursor: "not-allowed",
};

const acceptBtn = {
  background: "#ff9800",
  color: "#fff",
};

export default ConnectionsPage;