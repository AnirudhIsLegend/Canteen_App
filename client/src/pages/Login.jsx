import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import socket from "../socket/socket";

function Login() {
  const [identifier, setIdentifier] = useState(""); // usn or username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        usn: identifier,
        username: identifier,
        password,
      });

      const { token, role } = res.data;

      // decode userId from token
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.id;

      // store auth data
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      // join socket room (socket will auto-join on reconnect too)
      socket.emit("join", { userId, token, role });

      // redirect based on role
      if (role === "admin") {
        navigate("/admin/orders");
      } else {
        navigate("/menu");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#F9FAFB",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 12,
          padding: "28px 24px 24px",
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 14px 35px rgba(15, 23, 42, 0.14)",
        }}
      >
        <h2
          style={{
            margin: "0 0 6px",
            fontSize: 22,
            color: "#0F766E",
          }}
        >
          Login
        </h2>
        <p
          style={{
            margin: "0 0 20px",
            fontSize: 14,
            color: "#6B7280",
          }}
        >
          Enter your details to access the canteen app.
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                display: "block",
                marginBottom: 4,
                fontSize: 14,
                color: "#374151",
              }}
            >
              USN or Username
            </label>
            <input
              placeholder="e.g. 1RV21CS001"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "9px 10px",
                borderRadius: 8,
                border: "1px solid #E5E7EB",
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                marginBottom: 4,
                fontSize: 14,
                color: "#374151",
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "9px 10px",
                borderRadius: 8,
                border: "1px solid #E5E7EB",
                fontSize: 14,
              }}
            />
          </div>

          {error && (
            <p
              style={{
                color: "#DC2626",
                fontSize: 13,
                margin: "0 0 10px",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#0F766E",
              color: "#FFFFFF",
              borderRadius: 10,
              fontSize: 15,
              marginTop: 4,
              boxShadow: "0 6px 16px rgba(15, 118, 110, 0.35)",
              transition: "transform 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
