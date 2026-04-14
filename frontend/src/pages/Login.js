import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
  try {
    if (!username || !password) {
      alert("Enter username & password");
      return;
    }

    console.log("SENDING:", username, password); // 🔍 debug

    const res = await axios.post(`${API}/auth/login`, {
      username: username.trim(),
      password: password.trim(),
    });

    console.log("LOGIN SUCCESS:", res.data);

    localStorage.setItem("user", JSON.stringify(res.data.user));

    navigate("/dashboard");

  } catch (err) {
    console.error("LOGIN ERROR:", err.response?.data || err.message);
    alert(err.response?.data?.error || "Login failed");
  }
};

  const register = async () => {
    try {
      await axios.post(`${API}/auth/register`, {
        username: username.trim(),
        password: password.trim(),
      });

      alert("Registered successfully! Now login.");

    } catch (err) {
      console.error("REGISTER ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "User already exists");
    }
  };

  return (
    <div className="center">
      <h1>CodeTracker 🚀</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>
      <button onClick={register}>Register</button>
    </div>
  );
}

export default Login;
