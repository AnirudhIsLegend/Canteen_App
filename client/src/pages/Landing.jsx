import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function Landing() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState({});
  const sectionsRef = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionsRef.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const fadeInStyle = (id) => ({
    opacity: isVisible[id] ? 1 : 0,
    transform: isVisible[id] ? "translateY(0)" : "translateY(30px)",
    transition: "opacity 0.8s ease, transform 0.8s ease",
  });

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* HERO SECTION */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, #0F766E 0%, #115E59 100%)",
          padding: "80px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            {/* Left Content */}
            <div>
              <h1
                style={{
                  fontSize: 64,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  lineHeight: 1.1,
                  marginBottom: 24,
                  letterSpacing: "-2px",
                }}
              >
                Skip the Queue. Order Smart. Eat Faster.
              </h1>
              <p
                style={{
                  fontSize: 20,
                  color: "rgba(255, 255, 255, 0.9)",
                  lineHeight: 1.6,
                  marginBottom: 40,
                }}
              >
                A real-time smart ordering system built for modern campuses.
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <button
                  onClick={() => navigate("/register")}
                  style={{
                    padding: "16px 32px",
                    background: "#F59E0B",
                    color: "#111827",
                    border: "none",
                    borderRadius: 12,
                    fontSize: 18,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(245, 158, 11, 0.4)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 12px 32px rgba(245, 158, 11, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 8px 24px rgba(245, 158, 11, 0.4)";
                  }}
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate("/admin/login")}
                  style={{
                    padding: "16px 32px",
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "#FFFFFF",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: 12,
                    fontSize: 18,
                    fontWeight: 600,
                    cursor: "pointer",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.2)";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.1)";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Login
                </button>
              </div>
            </div>

            {/* Right - Floating Mock UI Card */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 20,
                  padding: 32,
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                  animation: "float 3s ease-in-out infinite",
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 20 }}>
                  Live Orders
                </h3>
                <div
                  style={{
                    padding: 16,
                    background: "#FEF3C7",
                    borderRadius: 12,
                    marginBottom: 12,
                    borderLeft: "4px solid #F59E0B",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 600, color: "#111827", marginBottom: 4 }}>Veg Dosa</div>
                      <div style={{ fontSize: 14, color: "#92400E" }}>⏱️ Preparing</div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#F59E0B" }}>4 min</div>
                  </div>
                </div>
                <div
                  style={{
                    padding: 16,
                    background: "#D1FAE5",
                    borderRadius: 12,
                    borderLeft: "4px solid #16A34A",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 600, color: "#111827", marginBottom: 4 }}>Idly (2 pcs)</div>
                      <div style={{ fontSize: 14, color: "#065F46" }}>✅ Ready</div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#16A34A" }}>Now</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Animation Keyframes */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @media (max-width: 768px) {
            section > div > div { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section
        id="how-it-works"
        ref={(el) => (sectionsRef.current["how-it-works"] = el)}
        style={{
          padding: "100px 24px",
          background: "#F9FAFB",
          ...fadeInStyle("how-it-works"),
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "#111827",
              textAlign: "center",
              marginBottom: 16,
              letterSpacing: "-1px",
            }}
          >
            How It Works
          </h2>
          <p style={{ fontSize: 18, color: "#6B7280", textAlign: "center", marginBottom: 60 }}>
            Three simple steps to skip the queue
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {[
              { icon: "📱", title: "Browse Menu", desc: "Explore our full menu with real-time availability" },
              { icon: "🛒", title: "Add to Cart", desc: "Select your items and customize your order" },
              { icon: "⏱️", title: "Track Live Status", desc: "Get real-time updates and ETA for your order" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "#FFFFFF",
                  padding: 40,
                  borderRadius: 16,
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.08)";
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 20 }}>{item.icon}</div>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SMART FEATURES SECTION */}
      <section
        id="features"
        ref={(el) => (sectionsRef.current["features"] = el)}
        style={{
          padding: "100px 24px",
          background: "#FFFFFF",
          ...fadeInStyle("features"),
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            {/* Left - Visual Placeholder */}
            <div
              style={{
                background: "linear-gradient(135deg, #0F766E, #115E59)",
                borderRadius: 20,
                padding: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 400,
              }}
            >
              <div style={{ fontSize: 120, opacity: 0.3 }}>⚡</div>
            </div>

            {/* Right - Features List */}
            <div>
              <h2
                style={{
                  fontSize: 48,
                  fontWeight: 800,
                  color: "#111827",
                  marginBottom: 24,
                  letterSpacing: "-1px",
                }}
              >
                Smart Features
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {[
                  { icon: "🔄", title: "Real-time Updates", desc: "WebSocket-powered live order tracking" },
                  { icon: "🧠", title: "Smart ETA Calculation", desc: "Batch-based intelligent wait time prediction" },
                  { icon: "🔐", title: "Secure Dashboards", desc: "Role-based access for students and admins" },
                  { icon: "⚙️", title: "Clean Admin Workflow", desc: "Streamlined order management interface" },
                ].map((feature, i) => (
                  <div key={i} style={{ display: "flex", gap: 16 }}>
                    <div
                      style={{
                        fontSize: 32,
                        width: 56,
                        height: 56,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#FEF3C7",
                        borderRadius: 12,
                        flexShrink: 0,
                      }}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
                        {feature.title}
                      </h4>
                      <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.6 }}>{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM → SOLUTION SECTION */}
      <section
        id="comparison"
        ref={(el) => (sectionsRef.current["comparison"] = el)}
        style={{
          padding: "100px 24px",
          background: "#111827",
          ...fadeInStyle("comparison"),
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "#FFFFFF",
              textAlign: "center",
              marginBottom: 60,
              letterSpacing: "-1px",
            }}
          >
            The Old Way vs The Smart Way
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            {/* Old System */}
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "2px solid rgba(239, 68, 68, 0.3)",
                borderRadius: 16,
                padding: 40,
              }}
            >
              <h3 style={{ fontSize: 28, fontWeight: 700, color: "#FCA5A5", marginBottom: 24 }}>
                ❌ Old System
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["Long queues during peak hours", "No idea when food will be ready", "Wasted time waiting around"].map(
                  (item, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: 18,
                        color: "rgba(255, 255, 255, 0.8)",
                        marginBottom: 16,
                        paddingLeft: 32,
                        position: "relative",
                      }}
                    >
                      <span style={{ position: "absolute", left: 0 }}>•</span>
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* New System */}
            <div
              style={{
                background: "rgba(34, 197, 94, 0.1)",
                border: "2px solid rgba(34, 197, 94, 0.3)",
                borderRadius: 16,
                padding: 40,
              }}
            >
              <h3 style={{ fontSize: 28, fontWeight: 700, color: "#86EFAC", marginBottom: 24 }}>
                ✅ New System
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[
                  "Predictable wait times with smart ETA",
                  "Live updates on order status",
                  "Organized workflow for staff",
                ].map((item, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: 18,
                      color: "rgba(255, 255, 255, 0.8)",
                      marginBottom: 16,
                      paddingLeft: 32,
                      position: "relative",
                    }}
                  >
                    <span style={{ position: "absolute", left: 0 }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section
        id="cta"
        ref={(el) => (sectionsRef.current["cta"] = el)}
        style={{
          padding: "120px 24px",
          background: "linear-gradient(135deg, #0F766E 0%, #115E59 100%)",
          textAlign: "center",
          ...fadeInStyle("cta"),
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#FFFFFF",
              marginBottom: 24,
              letterSpacing: "-1px",
              lineHeight: 1.2,
            }}
          >
            Ready to modernize your campus canteen?
          </h2>
          <p style={{ fontSize: 20, color: "rgba(255, 255, 255, 0.9)", marginBottom: 40, lineHeight: 1.6 }}>
            Join the smart ordering revolution today
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "20px 48px",
              background: "#F59E0B",
              color: "#111827",
              border: "none",
              borderRadius: 12,
              fontSize: 20,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(245, 158, 11, 0.4)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px) scale(1.05)";
              e.target.style.boxShadow = "0 16px 40px rgba(245, 158, 11, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0) scale(1)";
              e.target.style.boxShadow = "0 8px 24px rgba(245, 158, 11, 0.4)";
            }}
          >
            Launch Ordering System
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 24px", background: "#111827", textAlign: "center" }}>
        <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 14 }}>
          © 2026 My Canteen. Built with ❤️ for modern campuses.
        </p>
      </footer>
    </div>
  );
}

export default Landing;
