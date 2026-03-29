import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Friends() {
  // ✅ FIX: parse user properly
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = storedUser?.username;

  const [sendTo, setSendTo] = useState("");
  const [requests, setRequests] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState("requests");

  // 🔹 SEND REQUEST
  const sendRequest = async () => {
    try {
      await axios.post("http://localhost:5000/api/friends/send-request", {
        from: currentUser, // ✅ now correct
        to: sendTo.trim()
      });

      alert("Request sent");
      setSendTo("");
    } catch (err) {
      console.error(err);
      alert("Error sending request");
    }
  };

  // 🔹 GET REQUESTS
  const getRequests = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/friends/requests/${currentUser}`
      );

      setRequests(res.data);
    } catch (err) {
      console.error(err);
      alert("Error loading requests");
    }
  };

  // 🔹 ACCEPT REQUEST
  const acceptRequest = async (fromUser) => {
    try {
      await axios.post("http://localhost:5000/api/friends/accept-request", {
        from: fromUser,
        to: currentUser
      });

      getRequests();
      loadLeaderboard();
    } catch (err) {
      console.error(err);
      alert("Error accepting request");
    }
  };

  // 🔹 LOAD LEADERBOARD
  const loadLeaderboard = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/friends/leaderboard/${currentUser}`
      );

      setLeaderboard(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 MEDALS
  const getMedal = (i) => {
    if (i === 0) return "🥇";
    if (i === 1) return "🥈";
    if (i === 2) return "🥉";
    return "";
  };

  // 🔹 AUTO LOAD
  useEffect(() => {
    if (!currentUser) return; // ✅ safety
    getRequests();
    loadLeaderboard();
  }, [currentUser]);

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Friends 👥</h2>

        {/* ➕ SEND REQUEST */}
        <div className="section">
          <input
            placeholder="Enter username..."
            value={sendTo}
            onChange={(e) => setSendTo(e.target.value)}
          />
          <button onClick={sendRequest}>Send Request</button>
        </div>

        {/* 🔀 TABS */}
        <div className="tabs">
          <button
            className={activeTab === "requests" ? "active" : ""}
            onClick={() => setActiveTab("requests")}
          >
            Requests
          </button>

          <button
            className={activeTab === "leaderboard" ? "active" : ""}
            onClick={() => setActiveTab("leaderboard")}
          >
            Leaderboard
          </button>
        </div>

        {/* 📥 REQUESTS */}
        {activeTab === "requests" && (
          <div>
            {requests.length === 0 && <p>No requests</p>}

            {requests.map((r, i) => (
              <div className="list-item" key={i}>
                <span>{r}</span>
                <button onClick={() => acceptRequest(r)}>Accept</button>
              </div>
            ))}
          </div>
        )}

        {/* 🏆 LEADERBOARD */}
        {activeTab === "leaderboard" && (
          <div>
            {leaderboard.length === 0 && <p>No friends yet</p>}

            {leaderboard.map((f, i) => (
              <div
                className="leaderboard-item"
                key={i}
                style={{
                  background:
                    f.username === currentUser ? "#1e293b" : "#020617"
                }}
              >
                <div>
                  <span className="rank">
                    {getMedal(i)} #{i + 1}
                  </span>
                  <span>{f.username}</span>
                </div>

                <span>{f.total} solved</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Friends;