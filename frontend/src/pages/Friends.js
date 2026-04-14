import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Friends() {
  // ✅ Safe user parsing
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = storedUser?.username;

  const [sendTo, setSendTo] = useState("");
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("requests");

  // 🔹 SEND REQUEST
  const sendRequest = async () => {
    if (!sendTo.trim()) return;

    try {
      await axios.post("/api/friends/send-request", {
        from: currentUser,
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
    if (!currentUser) return;

    try {
      const res = await axios.get(
        `/api/friends/requests/${currentUser}`
      );

      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Error loading requests");
    }
  };

  // 🔹 ACCEPT REQUEST
  const acceptRequest = async (fromUser) => {
    try {
      await axios.post("/api/friends/accept-request", {
        from: fromUser,
        to: currentUser
      });

      getRequests();
    } catch (err) {
      console.error(err);
      alert("Error accepting request");
    }
  };

  // 🔹 AUTO LOAD
  useEffect(() => {
    if (!currentUser) return;
    getRequests();
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

        {/* 🔀 TABS (only requests now) */}
        <div className="tabs">
          <button className="active">Requests</button>
        </div>

        {/* 📥 REQUESTS */}
        <div>
          {requests.length === 0 && <p>No requests</p>}

          {requests.map((r, i) => (
            <div className="list-item" key={i}>
              <span>{r}</span>
              <button onClick={() => acceptRequest(r)}>Accept</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Friends;
