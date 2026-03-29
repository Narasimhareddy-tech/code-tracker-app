import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Chat() {
  // ✅ FIX: parse user properly
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = storedUser?.username;

  const [friends, setFriends] = useState([]);
  const [selected, setSelected] = useState("");
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  // 📥 load friends
  useEffect(() => {
    if (!currentUser) return;
    loadFriends();
  }, [currentUser]);

  const loadFriends = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/friends/list/${currentUser}`
      );

      setFriends(res.data || []);
    } catch (err) {
      console.error("FRIENDS ERROR:", err.response?.data || err.message);
    }
  };

  // 📥 load chat
  const loadChat = async (friend) => {
    try {
      setSelected(friend);

      const res = await axios.get(
        `http://localhost:5000/api/chat/${currentUser}/${friend}`
      );

      setChat(res.data || []);
    } catch (err) {
      console.error("CHAT LOAD ERROR:", err.response?.data || err.message);
      setChat([]);
    }
  };

  // 📤 send message
  const sendMessage = async () => {
    if (!message.trim() || !selected) return;

    try {
      await axios.post("http://localhost:5000/api/chat/send", {
        from: currentUser,
        to: selected,
        text: message.trim()
      });

      setMessage("");
      loadChat(selected);
    } catch (err) {
      console.error("SEND ERROR:", err.response?.data || err.message);
    }
  };
useEffect(() => {
  if (!currentUser || !selected) return;

  const interval = setInterval(() => {
    loadChat(selected);
  }, 2000); // every 2 sec

  return () => clearInterval(interval);

}, [selected, currentUser]);
  return (
    <>
      <Navbar />

      <div style={{ display: "flex", height: "90vh" }}>
        
        {/* LEFT: FRIENDS */}
        <div style={{
          width: "25%",
          background: "#020617",
          padding: "10px"
        }}>
          <h3>Friends</h3>

          {friends.length === 0 && <p>No friends yet</p>}

          {friends.map((f, i) => (
            <div
              key={i}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid gray",
                background: selected === f ? "#1e293b" : "transparent"
              }}
              onClick={() => loadChat(f)}
            >
              {f}
            </div>
          ))}
        </div>

        {/* RIGHT: CHAT */}
        <div style={{ flex: 1, padding: "20px" }}>
          <h3>Chat with {selected || "..."}</h3>

          <div style={{
            height: "70%",
            overflowY: "auto",
            border: "1px solid gray",
            padding: "10px"
          }}>
            {chat.length === 0 && <p>No messages</p>}

            {chat.map((msg, i) => (
              <div key={i} style={{
                textAlign: msg.from === currentUser ? "right" : "left"
              }}>
                <p>
                  <b>{msg.from}:</b> {msg.text}
                </p>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div style={{ marginTop: "10px" }}>
            <input
              placeholder="Type message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;