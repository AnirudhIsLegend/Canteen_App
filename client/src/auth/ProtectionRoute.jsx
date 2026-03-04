import { Navigate } from "react-router-dom";

function getRole() {
  return localStorage.getItem("role"); // "student" | "admin"
}

function getToken() {
  return localStorage.getItem("token");
}

export function StudentOnly({ children }) {
  const token = getToken();
  const role = getRole();

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "student") return <Navigate to="/login" replace />;

  return children;
}

export function AdminOnly({ children }) {
  const token = getToken();
  const role = getRole();

  if (!token) return <Navigate to="/admin/login" replace />;
  if (role !== "admin") return <Navigate to="/admin/login" replace />;

  return children;
}
