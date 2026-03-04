import { useEffect, useState } from "react";
import api from "../api/axios";
import Header from "../components/Header";
import socket from "../socket/socket";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const handleNewOrder = (payload) => {
      console.log("📥 Received new order via socket:", payload);

      // Add the new order to the beginning of the orders list
      if (payload && payload.orderId) {
        setOrders((prevOrders) => {
          // Check if order already exists to prevent duplicates
          const exists = prevOrders.some(o => o._id === payload.orderId);
          if (exists) {
            console.log("Order already exists, skipping duplicate");
            return prevOrders;
          }

          // Create order object from socket payload
          const newOrder = {
            _id: payload.orderId,
            student: payload.student,
            items: payload.items,
            totalAmount: payload.totalAmount,
            status: payload.status,
            estimatedReadyTime: payload.estimatedReadyTime,
            createdAt: payload.createdAt || new Date(),
          };

          return [newOrder, ...prevOrders];
        });

        // Highlight the new order
        setHighlightedOrderId(payload.orderId);
      }
    };

    socket.on("order:new", handleNewOrder);
    return () => {
      socket.off("order:new", handleNewOrder);
    };
  }, []);

  useEffect(() => {
    if (!highlightedOrderId) return;
    const id = setTimeout(() => setHighlightedOrderId(null), 3000);
    return () => clearTimeout(id);
  }, [highlightedOrderId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Failed to fetch orders:", err.response || err);

      // Handle different error types appropriately
      if (err.response?.status === 401) {
        // Unauthorized - token is invalid or expired
        setError("Session expired. Please login again.");
        setOrders([]);
      } else if (err.response?.status === 403) {
        // Forbidden - user doesn't have permission
        setError("You don't have permission to view orders.");
        setOrders([]);
      } else {
        // Other errors (500, network errors, etc.)
        setError("Failed to load orders. Please try refreshing the page.");
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      fetchOrders(); // refresh after update
    } catch (err) {
      console.error("Failed to update order status:", err.response || err);
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  return (
    <div style={{ background: "#F9FAFB", minHeight: "100vh" }}>
      <Header title="Admin orders" />

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "24px 16px 40px",
        }}
      >
        {error && <p style={{ color: "#DC2626" }}>{error}</p>}

        {loading && <p style={{ color: "#6B7280" }}>Loading orders…</p>}

        {!loading && !error && orders.length === 0 && (
          <p style={{ color: "#6B7280" }}>No orders yet.</p>
        )}

        {orders.map((order) => {
          const isNew = order._id === highlightedOrderId;
          return (
            <div
              key={order._id}
              style={{
                background: isNew ? "#ECFEFF" : "#FFFFFF",
                color: "#111827",
                padding: "18px 18px 16px",
                marginBottom: "16px",
                borderRadius: 10,
                boxShadow: "0 3px 10px rgba(15, 23, 42, 0.08)",
                border: isNew
                  ? "1px solid rgba(15, 118, 110, 0.5)"
                  : "1px solid rgba(15, 23, 42, 0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 8,
                  gap: 8,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                  }}
                >
                  <strong>Student:</strong>{" "}
                  <span style={{ color: "#6B7280" }}>
                    {order.student?.usn || order.student?.username}
                  </span>
                </p>

                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: "rgba(107, 114, 128, 0.08)",
                    color: "#6B7280",
                  }}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>

              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: 14,
                }}
              >
                <strong>Total:</strong> ₹{order.totalAmount}
              </p>

              <strong>Items</strong>
              <ul
                style={{
                  paddingLeft: 18,
                  margin: "6px 0 0",
                  color: "#374151",
                  fontSize: 14,
                }}
              >
                {order.items.map((item) => (
                  <li key={item._id}>
                    {item.menuItem?.name} × {item.quantity}
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: "12px", display: "flex", gap: 8 }}>
                {role === "admin" && order.status !== "preparing" && (
                  <button
                    onClick={() => updateStatus(order._id, "preparing")}
                    style={{
                      background: "#F59E0B",
                      color: "#111827",
                    }}
                  >
                    Preparing
                  </button>
                )}

                {role === "admin" && order.status !== "ready" && (
                  <button
                    onClick={() => updateStatus(order._id, "ready")}
                    style={{
                      background: "#16A34A",
                      color: "#FFFFFF",
                    }}
                  >
                    Ready
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminOrders;
