import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt, FaEnvelope, FaLock } from "react-icons/fa";
import "../App.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(email, password);
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed!");
    }
  };

  return (
    <div className="dashboard">
      <form className="dashboard-card dashboard-form" style={{ background: "linear-gradient(120deg, #f5f7fa 0%, #c3cfe2 100%)", color: "#222" }} onSubmit={handleSubmit}>
        <h2 className="dashboard-title" style={{ color: "#222", background: "none", WebkitBackgroundClip: "initial", WebkitTextFillColor: "initial" }}>
          <FaSignInAlt style={{ marginRight: 8, verticalAlign: "middle", color: "#2575fc" }} /> Login
        </h2>
        <label className="dashboard-label" style={{ color: "#222" }}>
          <FaEnvelope style={{ marginRight: 6, color: "#2575fc" }} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="dashboard-label" style={{ color: "#222" }}>
          <FaLock style={{ marginRight: 6, color: "#2575fc" }} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="dashboard-btn" type="submit" style={{ color: "#fff" }}>
          <FaSignInAlt style={{ marginRight: 6, color: "#fff" }} /> Login
        </button>
      </form>
    </div>
  );
}

