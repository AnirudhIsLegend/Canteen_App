import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../cart/CartContext";

function Header({ title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const { count } = useCart();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("cart");
    navigate("/");
  };

  const isStudent = role === "student";
  const isAdmin = role === "admin";

  const linkStyle = (active) => {
    const primaryColor = isAdmin ? "#F97316" : "#0F766E";
    return {
      padding: "8px 10px",
      borderRadius: 999,
      color: active ? "#FFFFFF" : "#111827",
      background: active ? primaryColor : "transparent",
      border: active ? `1px solid ${primaryColor}` : "1px solid transparent",
      fontSize: 14,
      cursor: "pointer",
      transition: "all 0.2s ease",
    };
  };

  return (
    <header
      style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
        padding: "10px 16px",
        marginBottom: 24,
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              background: "linear-gradient(135deg, #16A34A 0%, #F97316 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.5px",
            }}
          >
            MY CANTEEN
          </div>
          {title && (
            <div
              style={{
                fontSize: 13,
                color: "#6B7280",
                marginTop: 2,
              }}
            >
              {title}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isStudent && (
            <>
              <button
                onClick={() => navigate("/menu")}
                style={linkStyle(location.pathname === "/menu")}
              >
                Menu
              </button>
              <button
                onClick={() => navigate("/cart")}
                style={{
                  ...linkStyle(location.pathname === "/cart" || location.pathname === "/payment"),
                  position: "relative",
                }}
              >
                Cart
                {count > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      background: "#F59E0B",
                      color: "#FFFFFF",
                      borderRadius: "50%",
                      width: 18,
                      height: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate("/orders")}
                style={linkStyle(location.pathname === "/orders")}
              >
                My Orders
              </button>
            </>
          )}

          {isAdmin && (
            <>
              <button
                onClick={() => navigate("/admin/menu")}
                style={linkStyle(location.pathname === "/admin/menu")}
              >
                Menu
              </button>
              <button
                onClick={() => navigate("/admin/orders/pending")}
                style={linkStyle(location.pathname === "/admin/orders/pending")}
              >
                Pending
              </button>
              <button
                onClick={() => navigate("/admin/orders/preparing")}
                style={linkStyle(location.pathname === "/admin/orders/preparing")}
              >
                Preparing
              </button>
              <button
                onClick={() => navigate("/admin/orders/ready")}
                style={linkStyle(location.pathname === "/admin/orders/ready")}
              >
                Ready
              </button>
            </>
          )}

          <button
            onClick={logout}
            style={{
              padding: "8px 14px",
              background: "#111827",
              color: "#FFFFFF",
              borderRadius: 999,
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

