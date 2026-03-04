import { useEffect, useState } from "react";
import api from "../api/axios";
import Header from "../components/Header";
import socket from "../socket/socket";

function AdminPendingOrders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [highlightedOrderId, setHighlightedOrderId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const handleNewOrder = (payload) => {
            console.log("📥 Received new order via socket:", payload);

            if (payload && payload.orderId && payload.status === "pending") {
                setOrders((prevOrders) => {
                    const exists = prevOrders.some((o) => o._id === payload.orderId);
                    if (exists) return prevOrders;

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
            const allOrders = Array.isArray(res.data) ? res.data : [];
            // Filter to only show pending orders
            setOrders(allOrders.filter((order) => order.status === "pending"));
        } catch (err) {
            console.error("❌ Failed to fetch orders:", err.response || err);
            setError("Failed to load orders. Please try refreshing the page.");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, status) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status });
            fetchOrders();
        } catch (err) {
            console.error("Failed to update order status:", err.response || err);
            alert(err.response?.data?.message || "Failed to update order status");
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div style={{ background: "#F9FAFB", minHeight: "100vh" }}>
            <Header title="Admin - Pending Orders" />

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
                    <p style={{ color: "#6B7280" }}>No pending orders.</p>
                )}

                {orders.map((order) => {
                    const isNew = order._id === highlightedOrderId;
                    return (
                        <div
                            key={order._id}
                            style={{
                                background: isNew ? "#FEE2E2" : "#FFFFFF",
                                color: "#111827",
                                padding: "20px 22px",
                                marginBottom: "16px",
                                borderRadius: 12,
                                boxShadow: "0 3px 10px rgba(220, 38, 38, 0.15)",
                                border: `2px solid ${isNew ? "#DC2626" : "#FEE2E2"}`,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "baseline",
                                    marginBottom: 10,
                                    gap: 8,
                                }}
                            >
                                <div>
                                    <p style={{ margin: "0 0 4px", fontSize: 14 }}>
                                        <strong>Student:</strong>{" "}
                                        <span style={{ color: "#6B7280" }}>
                                            {order.student?.usn || order.student?.username}
                                        </span>
                                    </p>
                                    <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>
                                        <strong>Placed:</strong> {formatDateTime(order.createdAt)}
                                    </p>
                                </div>

                                <span
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 700,
                                        padding: "6px 14px",
                                        borderRadius: 999,
                                        background: "#FEE2E2",
                                        color: "#DC2626",
                                    }}
                                >
                                    🔴 PENDING
                                </span>
                            </div>

                            <p style={{ margin: "0 0 10px", fontSize: 14 }}>
                                <strong>Total:</strong> ₹{order.totalAmount}
                            </p>

                            <strong style={{ fontSize: 14 }}>Items</strong>
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

                            <div style={{ marginTop: "16px", display: "flex", gap: 10 }}>
                                <button
                                    onClick={() => updateStatus(order._id, "preparing")}
                                    style={{
                                        flex: 1,
                                        padding: "12px",
                                        background: "#F59E0B",
                                        color: "#FFFFFF",
                                        borderRadius: 8,
                                        fontWeight: 600,
                                        fontSize: 14,
                                    }}
                                >
                                    ⏳ Mark as Preparing
                                </button>
                                <button
                                    onClick={() => updateStatus(order._id, "ready")}
                                    style={{
                                        flex: 1,
                                        padding: "12px",
                                        background: "#16A34A",
                                        color: "#FFFFFF",
                                        borderRadius: 8,
                                        fontWeight: 600,
                                        fontSize: 14,
                                    }}
                                >
                                    ✅ Mark as Ready
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default AdminPendingOrders;
