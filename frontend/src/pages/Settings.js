import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Settings() {
  // ✅ FIX: parse user properly
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const username = storedUser?.username;

  const [lc, setLc] = useState("");
  const [cc, setCc] = useState("");
  const [cf, setCf] = useState("");
  const [avatar, setAvatar] = useState("avatar1");

  useEffect(() => {
    if (username) {
      loadUserData();
    }
  }, [username]);

  const loadUserData = async () => {
    try {
      const res = await axios.get(
        `/api/user/${username}` // ✅ FIXED
      );

      setLc(res.data.lcUsername || "");
      setCc(res.data.ccUsername || "");
      setCf(res.data.cfUsername || "");
      setAvatar(res.data.avatar || "avatar1");

      localStorage.setItem("avatar", res.data.avatar || "avatar1");

    } catch (err) {
      console.error("LOAD ERROR:", err.response?.data || err.message);
    }
  };

  const save = async () => {
    try {
      await axios.put("/api/user/update", {
        username: username, // ✅ FIXED
        lcUsername: lc,
        ccUsername: cc,
        cfUsername: cf,
        avatar
      });

      localStorage.setItem("avatar", avatar);

      alert("Saved!");

    } catch (err) {
      console.error("SAVE ERROR:", err.response?.data || err.message);
      alert("Save failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Settings</h2>

        <input
          placeholder="LeetCode Username"
          value={lc}
          onChange={(e) => setLc(e.target.value)}
        />

        <input
          placeholder="CodeChef Username"
          value={cc}
          onChange={(e) => setCc(e.target.value)}
        />

        <input
          placeholder="Codeforces Username"
          value={cf}
          onChange={(e) => setCf(e.target.value)}
        />

        <h3>Select Avatar</h3>

        <div style={{ display: "flex", gap: "10px" }}>
          {["avatar1", "avatar2", "avatar3", "avatar4"].map((a) => (
            <img
              key={a}
              src={`/avatars/${a}.png`}
              alt={a}
              width={60}
              style={{
                border: avatar === a ? "3px solid cyan" : "2px solid gray",
                borderRadius: "50%",
                cursor: "pointer"
              }}
              onClick={() => setAvatar(a)}
            />
          ))}
        </div>

        <button onClick={save}>Save</button>
      </div>
    </>
  );
}

export default Settings;