import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import socket from "../socket/socket";
import Header from "../components/Header";


function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const [readyNotice, setReadyNotice] = useState("");
  const [recentReadyOrderId, setRecentReadyOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();

    const handleStatusUpdated = (data) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === data.orderId
            ? { ...order, status: data.status }
            : order
        )
      );

      if (data.status === "ready") {
        setReadyNotice("One of your orders is ready for pickup.");
        setRecentReadyOrderId(data.orderId);
        setTimeout(() => {
          setReadyNotice("");
          setRecentReadyOrderId(null);
        }, 4000);
      }
    };

    // listen for live updates
    socket.on("order:statusUpdated", handleStatusUpdated);

    return () => {
      socket.off("order:statusUpdated", handleStatusUpdated);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, []);


  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/orders/my");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      const msg =
        err.response?.status === 401
          ? "Please login to view your orders."
          : "We couldn’t load your orders right now. Please try again.";
      setError(msg);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (estimatedReadyTime, status) => {
    // If order is ready, show 0
    if (status === "ready") return "0 min";

    // Instant items or items without ETA
    if (!estimatedReadyTime) {
      if (status === "preparing") return "Being prepared...";
      return "Processing...";
    }

    const diffMs = new Date(estimatedReadyTime).getTime() - now;
    if (diffMs <= 0) return "0 min";

    const totalSec = Math.floor(diffMs / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min} min ${sec} sec`;
  };

  const hasOrders = useMemo(() => orders.length > 0, [orders.length]);

  return (
    <div style={{ background: "#F9FAFB", minHeight: "100vh" }}>
      <Header title="My orders" />

      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "24px 16px 40px",
        }}
      >
        {readyNotice && (
          <div
            style={{
              background: "#ECFEFF",
              borderRadius: 10,
              border: "1px solid rgba(34, 197, 235, 0.5)",
              padding: "10px 12px",
              marginBottom: 14,
              color: "#0F172A",
              fontSize: 14,
            }}
          >
            {readyNotice}
          </div>
        )}
        {error && <p style={{ color: "#DC2626" }}>{error}</p>}

        {loading && <p style={{ color: "#6B7280" }}>Loading your orders…</p>}

        {!loading && !error && !hasOrders && (
          <p style={{ color: "#6B7280" }}>
            No orders yet. Place your first order from the menu.
          </p>
        )}

        {orders.map((order) => {
          const statusColor =
            order.status === "ready"
              ? "#16A34A"
              : order.status === "preparing"
                ? "#F59E0B"
                : "#6B7280";

          const badgeBg =
            order.status === "ready"
              ? "rgba(22, 163, 74, 0.08)"
              : order.status === "preparing"
                ? "rgba(245, 158, 11, 0.08)"
                : "rgba(107, 114, 128, 0.08)";

          const isActive = order.status === "pending" || order.status === "preparing";
          const isRecentlyReady = order._id === recentReadyOrderId;

          return (
            <div
              key={order._id}
              style={{
                background: isRecentlyReady ? "#ECFEFF" : "#FFFFFF",
                padding: "18px 18px 16px",
                marginBottom: "16px",
                borderRadius: 10,
                boxShadow: "0 3px 10px rgba(15, 23, 42, 0.08)",
                border: isActive
                  ? "1px solid rgba(15, 118, 110, 0.25)"
                  : "1px solid rgba(15, 23, 42, 0.04)",
                opacity: order.status === "ready" ? 0.88 : 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: "#6B7280",
                  }}
                >
                  Placed:{" "}
                  {new Date(order.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>

                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 999,
                    color: statusColor,
                    background: badgeBg,
                  }}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>

              <p
                style={{
                  margin: "4px 0 8px",
                  fontSize: 14,
                  color: "#6B7280",
                }}
              >
                <strong style={{ color: "#111827" }}>Estimated Time:</strong>{" "}
                {formatCountdown(order.estimatedReadyTime, order.status)}
              </p>

              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 14,
                }}
              >
                <strong>Total:</strong> ₹{order.totalAmount}
              </p>

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #E5E7EB",
                  margin: "10px 0",
                }}
              />

              <div>
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyOrders;
