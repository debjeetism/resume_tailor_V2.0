import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaEnvelope, FaLock } from "react-icons/fa";
import "../App.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await register(email, password);
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      alert("Registration failed. Try again.");
    }
  };

  return (
    <div className="dashboard">
      <form className="dashboard-card dashboard-form" style={{ background: "linear-gradient(120deg, #f5f7fa 0%, #c3cfe2 100%)", color: "#222" }} onSubmit={handleSubmit}>
        <h2 className="dashboard-title" style={{ color: "#222", background: "none", WebkitBackgroundClip: "initial", WebkitTextFillColor: "initial" }}>
          <FaUserPlus style={{ marginRight: 8, verticalAlign: "middle", color: "#2575fc" }} /> Register
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
        <label className="dashboard-label" style={{ color: "#222" }}>
          <FaLock style={{ marginRight: 6, color: "#2575fc" }} />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button className="dashboard-btn" type="submit" style={{ color: "#fff" }}>
          <FaUserPlus style={{ marginRight: 6, color: "#fff" }} /> Register
        </button>
      </form>
      <p style={{ marginTop: "1rem", color: "#222" }}>
        Already have an account?{" "}
        <a href="/" style={{ color: "#2575fc", textDecoration: "underline" }}>Login here</a>
      </p>
    </div>
  );
}

