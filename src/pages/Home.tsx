import { useState } from "react";

const styles = {
  container: {
    fontFamily: "Inter, system-ui, sans-serif",
    color: "#0f172a",
    background: "linear-gradient(180deg, #f8fafc, #eef2ff)",
    minHeight: "100vh",
  },
  section: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "80px 20px",
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "40px",
    alignItems: "center",
  },
  badge: {
    display: "inline-block",
    padding: "6px 12px",
    background: "#e0e7ff",
    color: "#3730a3",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: 600,
  },
  title: {
    fontSize: "56px",
    lineHeight: 1.1,
    margin: "20px 0",
  },
  subtitle: {
    fontSize: "18px",
    color: "#475569",
    maxWidth: "520px",
  },
  buttonPrimary: {
    padding: "14px 26px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
  },
  buttonSecondary: {
    padding: "14px 26px",
    background: "transparent",
    border: "1px solid #c7d2fe",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
  },
  heroCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "30px",
  },
  featureCard: {
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  },
  pricingCard: {
    background: "#fff",
    padding: "40px",
    borderRadius: "18px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    textAlign: "center" as const,
  },
};

export default function Home() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div style={styles.container}>
      {/* HERO */}
      <section style={styles.section}>
        <div style={styles.hero}>
          <div>
            <span style={styles.badge}>🚀 New • Secure Cloud Storage</span>
            <h1 style={styles.title}>
              Store, Sync & Share files <br /> without limits
            </h1>
            <p style={styles.subtitle}>
              CloudBox helps teams securely store files, collaborate in real-time,
              and deploy faster without worrying about infrastructure.
            </p>

            <div style={{ display: "flex", gap: "14px", marginTop: "30px" }}>
              <button style={styles.buttonPrimary}>Start Free Trial</button>
              <button style={styles.buttonSecondary}>View Demo</button>
            </div>
          </div>

          <div style={styles.heroCard}>
            <h3>📂 Storage Overview</h3>
            <p>Used: 12.4 GB / 100 GB</p>
            <progress value={12.4} max={100} style={{ width: "100%" }} />
            <ul style={{ marginTop: "20px", color: "#475569" }}>
              <li>✔ Encrypted uploads</li>
              <li>✔ Version history</li>
              <li>✔ Team sharing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={styles.section}>
        <h2 style={{ fontSize: "36px", marginBottom: "40px" }}>
          Why teams choose CloudBox
        </h2>

        <div style={styles.grid3}>
          <div style={styles.featureCard}>
            <h3>⚡ Fast Uploads</h3>
            <p>
              Optimized upload pipelines with resumable transfers and real-time
              progress tracking.
            </p>
          </div>

          <div style={styles.featureCard}>
            <h3>🔐 Enterprise Security</h3>
            <p>
              End-to-end encryption, signed URLs, and strict access control.
            </p>
          </div>

          <div style={styles.featureCard}>
            <h3>📈 Scale Effortlessly</h3>
            <p>
              Designed to scale from solo developers to large distributed teams.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={styles.section}>
        <h2 style={{ fontSize: "36px", marginBottom: "10px" }}>
          Simple pricing
        </h2>
        <p style={{ color: "#475569", marginBottom: "30px" }}>
          Switch between monthly and yearly billing
        </p>

        <div style={{ marginBottom: "30px" }}>
          <button
            onClick={() => setBilling("monthly")}
            style={{
              ...styles.buttonSecondary,
              background: billing === "monthly" ? "#eef2ff" : "transparent",
            }}
          >
            Monthly
          </button>{" "}
          <button
            onClick={() => setBilling("yearly")}
            style={{
              ...styles.buttonSecondary,
              background: billing === "yearly" ? "#eef2ff" : "transparent",
            }}
          >
            Yearly (Save 20%)
          </button>
        </div>

        <div style={styles.grid3}>
          <div style={styles.pricingCard}>
            <h3>Starter</h3>
            <p style={{ fontSize: "40px" }}>
              ₹{billing === "monthly" ? "0" : "0"}
            </p>
            <p>10 GB Storage</p>
            <button style={styles.buttonPrimary}>Get Started</button>
          </div>

          <div style={{ ...styles.pricingCard, border: "2px solid #4f46e5" }}>
            <h3>Pro</h3>
            <p style={{ fontSize: "40px" }}>
              ₹{billing === "monthly" ? "499" : "4,799"}
            </p>
            <p>1 TB Storage</p>
            <button style={styles.buttonPrimary}>Start Trial</button>
          </div>

          <div style={styles.pricingCard}>
            <h3>Enterprise</h3>
            <p style={{ fontSize: "40px" }}>Custom</p>
            <p>Unlimited</p>
            <button style={styles.buttonSecondary}>Contact Sales</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
        © {new Date().getFullYear()} CloudBox Inc. All rights reserved.
      </footer>
    </div>
  );
}
