import { useNavigate } from "react-router-dom";


function Navbar() {
  const navigate = useNavigate();
const storedUser = JSON.parse(localStorage.getItem("user"));
const username = storedUser?.username;  const avatar = localStorage.getItem("avatar") || "avatar1";
const handleLogout = () => {
  localStorage.clear(); // remove user, avatar, etc.
  navigate("/"); // go back to login page
};
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      background: "#020617"
    }}>
      <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
        CodeTracker 🚀
      </h2>

     <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  <img
    src={`/avatars/${avatar}.png`}
    alt="avatar"
    width={40}
    style={{ borderRadius: "50%" }}
  />
  <span>{username}</span>

  <button onClick={() => navigate("/settings")}>⚙️</button>
  <button onClick={() => navigate("/friends")}>👥</button>
  <button onClick={() => navigate("/chat")}>💬</button>

  <button onClick={handleLogout}>Logout</button>
</div>
    </div>
  );
}

export default Navbar;