import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";

function AdminMenu() {
    const [menu, setMenu] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        preparationType: "instant",
        stock: 0,
        prepTimePerBatch: 0,
        batchCapacity: 0,
        available: true,
    });

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
            setError("Failed to load menu");
            setMenu([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                price: parseFloat(formData.price),
                preparationType: formData.preparationType,
                available: formData.available,
            };

            if (formData.preparationType === "instant") {
                payload.stock = parseInt(formData.stock);
            } else {
                payload.prepTimePerBatch = parseInt(formData.prepTimePerBatch);
                payload.batchCapacity = parseInt(formData.batchCapacity);
            }

            await api.post("/menu", payload);

            // Reset form
            setFormData({
                name: "",
                price: "",
                preparationType: "instant",
                stock: 0,
                prepTimePerBatch: 0,
                batchCapacity: 0,
                available: true,
            });
            setShowAddForm(false);
            fetchMenu();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add menu item");
        }
    };

    const handleDeleteItem = async (id, itemName) => {
        if (!window.confirm(`Delete "${itemName}"?`)) return;

        try {
            await api.delete(`/menu/${id}`);
            fetchMenu();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete menu item");
        }
    };

    return (
        <div style={{ background: "#F9FAFB", minHeight: "100vh" }}>
            <Header title="Admin - Menu Management" />

            <div
                style={{
                    maxWidth: 960,
                    margin: "0 auto",
                    padding: "24px 16px 40px",
                }}
            >
                <div style={{ marginBottom: 24, display: "flex", gap: 12 }}>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        style={{
                            padding: "12px 24px",
                            background: showAddForm ? "#6B7280" : "#F97316",
                            color: "#FFFFFF",
                            borderRadius: 10,
                            fontSize: 15,
                            fontWeight: 600,
                            boxShadow: "0 4px 12px rgba(249, 115, 22, 0.3)",
                        }}
                    >
                        {showAddForm ? "Cancel" : "➕ Add New Item"}
                    </button>
                </div>

                {showAddForm && (
                    <div
                        style={{
                            background: "#FFFFFF",
                            padding: "24px",
                            borderRadius: 12,
                            marginBottom: 24,
                            border: "2px solid #F97316",
                            boxShadow: "0 4px 16px rgba(249, 115, 22, 0.15)",
                        }}
                    >
                        <h3 style={{ margin: "0 0 20px", color: "#1F2937" }}>
                            Add New Menu Item
                        </h3>
                        <form onSubmit={handleAddItem}>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                                    Item Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        borderRadius: 8,
                                        border: "2px solid #E5E7EB",
                                        fontSize: 14,
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                                    Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        borderRadius: 8,
                                        border: "2px solid #E5E7EB",
                                        fontSize: 14,
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                                    Preparation Type *
                                </label>
                                <select
                                    name="preparationType"
                                    value={formData.preparationType}
                                    onChange={handleInputChange}
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        borderRadius: 8,
                                        border: "2px solid #E5E7EB",
                                        fontSize: 14,
                                    }}
                                >
                                    <option value="instant">Instant (Stock-based)</option>
                                    <option value="prepared">Prepared Fresh</option>
                                </select>
                            </div>

                            {formData.preparationType === "instant" && (
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                                        Stock Quantity
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        min="0"
                                        style={{
                                            width: "100%",
                                            padding: "10px 12px",
                                            borderRadius: 8,
                                            border: "2px solid #E5E7EB",
                                            fontSize: 14,
                                        }}
                                    />
                                </div>
                            )}

                            {formData.preparationType === "prepared" && (
                                <>
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                                            Prep Time Per Batch (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            name="prepTimePerBatch"
                                            value={formData.prepTimePerBatch}
                                            onChange={handleInputChange}
                                            min="0"
                                            style={{
                                                width: "100%",
                                                padding: "10px 12px",
                                                borderRadius: 8,
                                                border: "2px solid #E5E7EB",
                                                fontSize: 14,
                                            }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                                            Batch Capacity
                                        </label>
                                        <input
                                            type="number"
                                            name="batchCapacity"
                                            value={formData.batchCapacity}
                                            onChange={handleInputChange}
                                            min="0"
                                            style={{
                                                width: "100%",
                                                padding: "10px 12px",
                                                borderRadius: 8,
                                                border: "2px solid #E5E7EB",
                                                fontSize: 14,
                                            }}
                                        />
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    background: "#F97316",
                                    color: "#FFFFFF",
                                    borderRadius: 10,
                                    fontSize: 16,
                                    fontWeight: 600,
                                    boxShadow: "0 4px 12px rgba(249, 115, 22, 0.3)",
                                }}
                            >
                                Add Item
                            </button>
                        </form>
                    </div>
                )}

                {loading && <p style={{ color: "#6B7280" }}>Loading menu...</p>}

                {!loading && !error && menu.length === 0 && (
                    <p style={{ color: "#6B7280" }}>No menu items yet. Add one above!</p>
                )}

                {error && <p style={{ color: "#DC2626" }}>{error}</p>}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "16px",
                    }}
                >
                    {menu.map((item) => (
                        <div
                            key={item._id}
                            style={{
                                background: "#FFFFFF",
                                padding: "20px",
                                borderRadius: 12,
                                border: "2px solid #E5E7EB",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                            }}
                        >
                            <div style={{ marginBottom: 16 }}>
                                <h4
                                    style={{
                                        margin: "0 0 8px",
                                        fontSize: 18,
                                        fontWeight: 600,
                                        color: "#1F2937",
                                    }}
                                >
                                    {item.name}
                                </h4>
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: 20,
                                        fontWeight: 700,
                                        color: "#F97316",
                                    }}
                                >
                                    ₹{item.price}
                                </p>
                            </div>

                            <div style={{ marginBottom: 12, fontSize: 14 }}>
                                <div style={{ marginBottom: 4 }}>
                                    <strong>Type:</strong>{" "}
                                    <span
                                        style={{
                                            padding: "2px 8px",
                                            borderRadius: 4,
                                            background:
                                                item.preparationType === "instant"
                                                    ? "#DCFCE7"
                                                    : "#FEF3C7",
                                            color:
                                                item.preparationType === "instant"
                                                    ? "#16A34A"
                                                    : "#F59E0B",
                                            fontSize: 12,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {item.preparationType}
                                    </span>
                                </div>

                                {item.preparationType === "instant" && (
                                    <div>
                                        <strong>Stock:</strong> {item.stock || 0}
                                    </div>
                                )}

                                {item.preparationType === "prepared" && (
                                    <>
                                        <div>
                                            <strong>Prep Time:</strong> {item.prepTimePerBatch || 0} min
                                        </div>
                                        <div>
                                            <strong>Batch Size:</strong> {item.batchCapacity || 0}
                                        </div>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={() => handleDeleteItem(item._id, item.name)}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    background: "#DC2626",
                                    color: "#FFFFFF",
                                    borderRadius: 8,
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminMenu;
