import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import { useCart } from "../cart/CartContext";

function Menu() {
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const { addItem } = useCart();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/menu");
      setMenu(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      const msg =
        err.response?.status === 401
          ? "Please login to view the menu."
          : "Menu is currently unavailable. Please try again in a minute.";
      setError(msg);
      setMenu([]);
    } finally {
      setLoading(false);
    }
  };

  const quickAdd = (item) => {
    addItem(item, 1);
    setNotice(`Added ${item.name} to cart`);
    setTimeout(() => setNotice(""), 1200);
  };

  return (
    <div style={{ background: "#F9FAFB", minHeight: "100vh" }}>
      <Header title="Student menu" />

      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "24px 16px 80px",
        }}
      >
        {notice && (
          <div
            style={{
              background: "#DCFCE7",
              border: "2px solid #16A34A",
              color: "#111827",
              padding: "12px 16px",
              borderRadius: 12,
              marginBottom: 20,
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            ✅ {notice}
          </div>
        )}

        {loading && <p style={{ color: "#6B7280" }}>Loading menu…</p>}

        {!loading && !error && menu.length === 0 && (
          <p style={{ color: "#6B7280" }}>Menu is currently unavailable.</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >

          {menu.map((item) => {
            const isInstant = item.preparationType === "instant";
            const isPrepared = item.preparationType === "prepared";
            const outOfStock = isInstant && item.stock === 0;

            return (
              <div
                key={item._id}
                style={{
                  background: "#FFFFFF",
                  color: "#111827",
                  padding: "20px",
                  marginBottom: "16px",
                  borderRadius: 16,
                  boxShadow: "0 4px 12px rgba(15, 118, 110, 0.12)",
                  border: outOfStock
                    ? "2px solid rgba(220, 38, 38, 0.2)"
                    : "2px solid rgba(15, 118, 110, 0.1)",
                  opacity: outOfStock ? 0.7 : 1,
                  transition: "all 0.3s ease",
                  aspectRatio: "1 / 1",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: 8,
                      gap: 8,
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        fontSize: 18,
                        fontWeight: 600,
                        color: "#0F766E",
                      }}
                    >
                      {item.name}
                    </h4>
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#0F766E",
                        fontSize: 18,
                      }}
                    >
                      ₹{item.price}
                    </span>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    {isInstant && (
                      <span
                        style={{
                          fontSize: 13,
                          color: outOfStock ? "#DC2626" : "#16A34A",
                          fontWeight: 600,
                        }}
                      >
                        Stock:{" "}
                        <strong>
                          {outOfStock ? "Out of stock" : item.stock}
                        </strong>
                      </span>
                    )}

                    {isPrepared && (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: 999,
                          background: "#FEF3C7",
                          color: "#F59E0B",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        🔥 Prepared fresh
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => quickAdd(item)}
                    disabled={outOfStock}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: 12,
                      background: outOfStock ? "#E5E7EB" : "linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)",
                      color: outOfStock ? "#6B7280" : "#FFFFFF",
                      cursor: outOfStock ? "not-allowed" : "pointer",
                      boxShadow: outOfStock
                        ? "none"
                        : "0 6px 20px rgba(15, 118, 110, 0.3)",
                      fontWeight: 600,
                      fontSize: 15,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {outOfStock ? "Out of stock" : "🛒 Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {error && <p style={{ color: "#DC2626" }}>{error}</p>}

        {role !== "admin" && (
          <button
            onClick={() => navigate("/cart")}
            style={{
              position: "sticky",
              bottom: 16,
              width: "100%",
              padding: "12px",
              background: "#0F766E",
              color: "#FFFFFF",
              borderRadius: 10,
              fontSize: 16,
              marginTop: 16,
              boxShadow: "0 6px 16px rgba(15, 118, 110, 0.35)",
            }}
          >
            View Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default Menu;
