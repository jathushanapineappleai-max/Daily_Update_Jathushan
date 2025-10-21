// src/components/admin_panel/Signin.js
import React, { useEffect, useState } from "react";
import "../../../styles/admin_panel/signin.css";
import eyeIcon from "../../../assets/icons/eye.png";
import pineappleai from "../../../assets/icons/pineappleai.png";
import backgroundimg from "../../../assets/icons/backgroundimg.png";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("rememberedEmail");
      if (stored) {
        setEmail(stored);
        setRemember(true);
      }
    } catch (e) {}
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    try {
      if (remember) {
        localStorage.setItem("rememberedEmail", email.trim());
      } else {
        localStorage.removeItem("rememberedEmail");
      }
    } catch (err) {}
    navigate("/admin/team");
  };

  const pageStyle = {
    backgroundImage: `url(${backgroundimg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div className="signin-page" style={pageStyle}>
      <div className="left-panel">
        <div className="brand">
          <img src={pineappleai} alt="PineappleAI logo" className="brand-icon" />
          <span className="brand-name">PineappleAI</span>
        </div>

        <h2 className="welcome-title">Welcome Back, <br />Administrator!</h2>
      </div>

      <div className="signin-card" role="region" aria-label="Admin sign in">
        <h1 className="signin-title">Login to your admin panel</h1>

        <form className="signin-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="email" className="field-label">Email</label>
          <div className="input-group">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              aria-required="true"
            />
          </div>

          <label htmlFor="password" className="field-label">Password</label>
          <div className="input-group password-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              aria-required="true"
            />

            {/* Use the imported asset here so webpack can resolve it reliably */}
            <button
              type="button"
              className="eye-button"
              onClick={() => setShowPassword((s) => !s)}
              aria-pressed={showPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{
                backgroundImage: `url(${eyeIcon})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "20px 20px",
              }}
            />
          </div>

          <div className="form-row">
            <label className="remember-me">
              <input
                type="checkbox"
                className="remember-checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                aria-checked={remember}
                aria-label="Remember my email"
              />
              <span className="remember-text">Remember Me</span>
            </label>
          </div>

          {error && <div className="signin-error" role="alert">{error}</div>}

          <button className="login-btn" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}