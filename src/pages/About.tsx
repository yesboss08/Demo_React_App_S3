export default function About() {
  return (
    <div style={styles.container}>
      <h1>About CloudBox</h1>

      <p style={styles.text}>
        CloudBox is a modern cloud storage platform built for developers,
        startups, and growing teams who want performance without complexity.
      </p>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>🚀 Our Mission</h3>
          <p>
            Make cloud storage fast, secure, and developer-friendly. trusted by brwaling coder
          </p>
        </div>

        <div style={styles.card}>
          <h3>🔐 Security First</h3>
          <p>
            Encryption, access control, and reliability are built in by design.
          </p>
        </div>

        <div style={styles.card}>
          <h3>📈 Built to Scale</h3>
          <p>
            From solo devs to enterprise workloads — CloudBox scales with you.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "80px 20px",
  },
  text: {
    fontSize: "18px",
    color: "#475569",
    marginBottom: "50px",
    maxWidth: "700px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "30px",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },
};
