import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import StatsChart from "../components/StatsChart";

function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const username = storedUser?.username;

  useEffect(() => {
    if (!username) {
      navigate("/");
      return;
    }

    loadUserData();
  }, [username]);

  const loadUserData = async () => {
    try {
      const res = await axios.get(`/api/user/${username}`);

      const lc = res.data.lcUsername;
      const cc = res.data.ccUsername;
      const cf = res.data.cfUsername;

      if (!lc && !cc && !cf) {
        setLoading(false);
        return;
      }

      await fetchStats(lc, cc, cf);

    } catch (err) {
      console.error("USER FETCH ERROR:", err.response?.data || err.message);
      setLoading(false);
    }
  };

  const fetchStats = async (lc, cc, cf) => {
    try {
      const res = await axios.get(
        `/api/stats?lc=${lc}&cc=${cc}&cf=${cf}`
      );

      console.log("🔥 DATA:", res.data); // debug

      setData(res.data);
      setLoading(false);

    } catch (err) {
      console.error("STATS ERROR:", err.response?.data || err.message);
      setLoading(false);
    }
  };

  // 🔄 Loading
  if (loading) {
    return (
      <>
        <Navbar />
        <h2 style={{ padding: "20px" }}>Loading...</h2>
      </>
    );
  }

  // ❌ No data safety
  if (!data) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "20px" }}>
          <h2>Welcome {username}</h2>
          <p>No data found. Please set usernames ⚙️</p>
          <button onClick={() => navigate("/settings")}>
            Go to Settings
          </button>
        </div>
      </>
    );
  }

  // ✅ Safe extraction
  const combined = data?.combined || {};
  const lcData = data?.leetcode || {};
  const ccData = data?.codechef || {};
  const cfData = data?.codeforces || {};

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Welcome {username} 👋</h2>

        {/* Linked Accounts */}
        <div style={{
          marginTop: "20px",
          background: "#020617",
          padding: "15px",
          borderRadius: "10px"
        }}>
          <h3>Linked Accounts 🔗</h3>

          <p><b>LeetCode:</b> {data.leetcodeUsername || "Not set"}</p>
          <p><b>CodeChef:</b> {data.codechefUsername || "Not set"}</p>
          <p><b>Codeforces:</b> {data.codeforcesUsername || "Not set"}</p>
        </div>

        {/* Stats Cards */}
        <div className="card-container">
          <div className="card">
            <h3>Total</h3>
            <p>{combined.totalSolved ?? 0}</p>
          </div>

          <div className="card">
            <h3>Easy</h3>
            <p>{combined.easy ?? 0}</p>
          </div>

          <div className="card">
            <h3>Medium</h3>
            <p>{combined.medium ?? 0}</p>
          </div>

          <div className="card">
            <h3>Hard</h3>
            <p>{combined.hard ?? 0}</p>
          </div>
        </div>

        {/* Graph */}
        <div className="graph-section">
          <h3>Progress Overview 📊</h3>
          <StatsChart data={combined} />
        </div>

        {/* Platform Cards */}
        <div className="platform-grid">
          <div className="platform-card">
            <h4>LeetCode</h4>
            <p>Easy: {lcData.easy ?? 0}</p>
            <p>Medium: {lcData.medium ?? 0}</p>
            <p>Hard: {lcData.hard ?? 0}</p>
          </div>

          <div className="platform-card">
            <h4>CodeChef</h4>
            <p>Total: {ccData.totalSolved ?? 0}</p>
            <p>Rating: {ccData.rating ?? 0}</p>
          </div>

          <div className="platform-card">
            <h4>Codeforces</h4>
            <p>Total: {cfData.totalSolved ?? 0}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
