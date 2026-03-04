import { useEffect, useState } from "react";
import api from "../api/axios";
import Header from "../components/Header";

function AdminPreparingOrders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await api.get("/orders");
            const allOrders = Array.isArray(res.data) ? res.data : [];
            // Filter to only show preparing orders
            setOrders(allOrders.filter((order) => order.status === "preparing"));
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
            <Header title="Admin - Preparing Orders" />

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
                    <p style={{ color: "#6B7280" }}>No orders being prepared.</p>
                )}

                {orders.map((order) => {
                    return (
                        <div
                            key={order._id}
                            style={{
                                background: "#FFFFFF",
                                color: "#111827",
                                padding: "20px 22px",
                                marginBottom: "16px",
                                borderRadius: 12,
                                boxShadow: "0 3px 10px rgba(245, 158, 11, 0.15)",
                                border: "2px solid #FEF3C7",
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
                                        background: "#FEF3C7",
                                        color: "#F59E0B",
                                    }}
                                >
                                    ⏳ PREPARING
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

                            <div style={{ marginTop: "16px" }}>
                                <button
                                    onClick={() => updateStatus(order._id, "ready")}
                                    style={{
                                        width: "100%",
                                        padding: "14px",
                                        background: "#16A34A",
                                        color: "#FFFFFF",
                                        borderRadius: 8,
                                        fontWeight: 600,
                                        fontSize: 15,
                                        boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)",
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

export default AdminPreparingOrders;
