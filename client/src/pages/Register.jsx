import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {
    const [usn, setUsn] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("student");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validation
        if (!usn && !username) {
            setError("Please provide either USN (for students) or Username (for admins)");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await api.post("/auth/register", {
                usn: usn || undefined,
                username: username || undefined,
                password,
                role,
            });

            setSuccess("Registration successful! Redirecting to login...");

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || "Registration failed");
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
                    maxWidth: 420,
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
                    Create Account
                </h2>
                <p
                    style={{
                        margin: "0 0 20px",
                        fontSize: 14,
                        color: "#6B7280",
                    }}
                >
                    Register to start ordering from the canteen.
                </p>

                <form onSubmit={handleRegister}>
                    {/* Role Selection */}
                    <div style={{ marginBottom: 14 }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: 4,
                                fontSize: 14,
                                color: "#374151",
                            }}
                        >
                            I am a
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "9px 10px",
                                borderRadius: 8,
                                border: "1px solid #E5E7EB",
                                fontSize: 14,
                                background: "#FFFFFF",
                            }}
                        >
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* USN (for students) */}
                    {role === "student" && (
                        <div style={{ marginBottom: 14 }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: 4,
                                    fontSize: 14,
                                    color: "#374151",
                                }}
                            >
                                USN
                            </label>
                            <input
                                placeholder="e.g. 1RV21CS001"
                                value={usn}
                                onChange={(e) => setUsn(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "9px 10px",
                                    borderRadius: 8,
                                    border: "1px solid #E5E7EB",
                                    fontSize: 14,
                                }}
                            />
                        </div>
                    )}

                    {/* Username (for admins) */}
                    {role === "admin" && (
                        <div style={{ marginBottom: 14 }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: 4,
                                    fontSize: 14,
                                    color: "#374151",
                                }}
                            >
                                Username
                            </label>
                            <input
                                placeholder="e.g. admin123"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "9px 10px",
                                    borderRadius: 8,
                                    border: "1px solid #E5E7EB",
                                    fontSize: 14,
                                }}
                            />
                        </div>
                    )}

                    {/* Password */}
                    <div style={{ marginBottom: 14 }}>
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

                    {/* Confirm Password */}
                    <div style={{ marginBottom: 18 }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: 4,
                                fontSize: 14,
                                color: "#374151",
                            }}
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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

                    {/* Error Message */}
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

                    {/* Success Message */}
                    {success && (
                        <p
                            style={{
                                color: "#16A34A",
                                fontSize: 13,
                                margin: "0 0 10px",
                            }}
                        >
                            {success}
                        </p>
                    )}

                    {/* Submit Button */}
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
                        Create Account
                    </button>
                </form>

                {/* Link to Login */}
                <p
                    style={{
                        marginTop: 16,
                        fontSize: 13,
                        color: "#6B7280",
                        textAlign: "center",
                    }}
                >
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        style={{
                            color: "#0F766E",
                            cursor: "pointer",
                            fontWeight: 600,
                        }}
                    >
                        Login here
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Register;
