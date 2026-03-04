import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useCart } from "../cart/CartContext";

function Cart() {
  const navigate = useNavigate();
  const { items, increase, decrease, remove, total, count } = useCart();
  const [notice, setNotice] = useState("");

  const rows = useMemo(() => items, [items]);

  const onProceed = () => {
    if (count === 0) {
      setNotice("Your cart is empty.");
      return;
    }
    navigate("/payment");
  };

  return (
    <div style={{ background: "#F9FAFB", minHeight: "100vh" }}>
      <Header title="Cart" />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 40px" }}>
        {notice && (
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              color: "#111827",
              padding: "10px 12px",
              borderRadius: 10,
              marginBottom: 14,
            }}
          >
            {notice}
          </div>
        )}

        {count === 0 ? (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 10,
              padding: 18,
              boxShadow: "0 3px 10px rgba(15, 23, 42, 0.08)",
              border: "1px solid rgba(15, 23, 42, 0.04)",
              color: "#6B7280",
            }}
          >
            Your cart is empty. Add items from the menu to place an order.
          </div>
        ) : (
          <>
            {rows.map((x) => (
              <div
                key={x.menuItemId}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 10,
                  padding: "16px 16px 14px",
                  marginBottom: 12,
                  boxShadow: "0 3px 10px rgba(15, 23, 42, 0.08)",
                  border: "1px solid rgba(15, 23, 42, 0.04)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  <div style={{ fontWeight: 600, color: "#111827" }}>
                    {x.name}
                  </div>
                  <div style={{ fontWeight: 600, color: "#111827" }}>
                    ₹{x.price}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      onClick={() => decrease(x.menuItemId)}
                      style={{
                        background: "#F3F4F6",
                        color: "#111827",
                        borderRadius: 10,
                        padding: "6px 10px",
                      }}
                    >
                      −
                    </button>
                    <div style={{ minWidth: 24, textAlign: "center" }}>
                      {x.quantity}
                    </div>
                    <button
                      onClick={() => increase(x.menuItemId)}
                      style={{
                        background: "#F3F4F6",
                        color: "#111827",
                        borderRadius: 10,
                        padding: "6px 10px",
                      }}
                    >
                      +
                    </button>
                  </div>

                  <div style={{ color: "#6B7280", fontSize: 13 }}>
                    Subtotal:{" "}
                    <strong style={{ color: "#111827" }}>
                      ₹{x.price * x.quantity}
                    </strong>
                  </div>

                  <button
                    onClick={() => remove(x.menuItemId)}
                    style={{
                      background: "transparent",
                      color: "#DC2626",
                      padding: "6px 8px",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 10,
                padding: 16,
                marginTop: 14,
                boxShadow: "0 3px 10px rgba(15, 23, 42, 0.08)",
                border: "1px solid rgba(15, 23, 42, 0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <div style={{ color: "#6B7280" }}>Total</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
                  ₹{total}
                </div>
              </div>

              <button
                onClick={onProceed}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#0F766E",
                  color: "#FFFFFF",
                  borderRadius: 10,
                  fontSize: 16,
                  boxShadow: "0 6px 16px rgba(15, 118, 110, 0.35)",
                }}
              >
                Proceed to Payment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;

