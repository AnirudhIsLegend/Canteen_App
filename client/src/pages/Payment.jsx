import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../api/axios";
import { useCart } from "../cart/CartContext";

function Payment() {
  const navigate = useNavigate();
  const { items, total, clear, count } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const orderPayload = useMemo(() => {
    return {
      items: items.map((x) => ({ menuItem: x.menuItemId, quantity: x.quantity })),
    };
  }, [items]);

  const payNow = async () => {
    if (count === 0) {
      setError("Your cart is empty.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Fake payment delay
      await new Promise((r) => setTimeout(r, 700));

      // Place the real order using existing API
      await api.post("/orders", orderPayload);

      setSuccess("Order placed successfully!");
      clear();

      // Small delay so user sees confirmation
      setTimeout(() => navigate("/orders"), 500);
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#F9FAFB", minHeight: "100vh" }}>
      <Header title="Payment (Test Mode)" />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 40px" }}>
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 10,
            padding: 18,
            boxShadow: "0 3px 10px rgba(15, 23, 42, 0.08)",
            border: "1px solid rgba(15, 23, 42, 0.04)",
            marginBottom: 14,
          }}
        >
          <div style={{ color: "#6B7280", fontSize: 13, marginBottom: 6 }}>
            This is a test payment. No real money involved.
          </div>

          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 10 }}>
            Order summary
          </div>

          {items.length === 0 ? (
            <div style={{ color: "#6B7280" }}>Your cart is empty.</div>
          ) : (
            <ul style={{ paddingLeft: 18, margin: "0 0 12px", color: "#374151" }}>
              {items.map((x) => (
                <li key={x.menuItemId} style={{ marginBottom: 4 }}>
                  {x.name} × {x.quantity}{" "}
                  <span style={{ color: "#6B7280" }}>
                    (₹{x.price * x.quantity})
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 10,
              borderTop: "1px solid #E5E7EB",
            }}
          >
            <div style={{ color: "#6B7280" }}>Total</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
              ₹{total}
            </div>
          </div>
        </div>

        {error && <p style={{ color: "#DC2626", marginTop: 0 }}>{error}</p>}
        {success && <p style={{ color: "#16A34A", marginTop: 0 }}>{success}</p>}

        <button
          onClick={payNow}
          disabled={loading || count === 0}
          style={{
            width: "100%",
            padding: "12px",
            background: loading || count === 0 ? "#94A3B8" : "#0F766E",
            color: "#FFFFFF",
            borderRadius: 10,
            fontSize: 16,
            boxShadow:
              loading || count === 0 ? "none" : "0 6px 16px rgba(15, 118, 110, 0.35)",
            cursor: loading || count === 0 ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing…" : "Pay Now (Test Mode)"}
        </button>

        <button
          onClick={() => navigate("/cart")}
          style={{
            width: "100%",
            marginTop: 10,
            padding: "12px",
            background: "#F3F4F6",
            color: "#111827",
            borderRadius: 10,
          }}
        >
          Back to Cart
        </button>
      </div>
    </div>
  );
}

export default Payment;

