export default function Login() {
  return (
    <div style={styles.wrapper}>
      <form style={styles.card}>
        <h1>Welcome back</h1>
        <p style={styles.sub}>Login to your CloudBox account</p>

        <input type="email" placeholder="Email" style={styles.input} />
        <input type="password" placeholder="Password" style={styles.input} />

        <button style={styles.button}>Login</button>

        <p style={styles.footerText}>
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "calc(100vh - 80px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8fafc",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
  },
  sub: {
    color: "#64748b",
    marginBottom: "30px",
  },
  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "16px",
    borderRadius: "10px",
    border: "1px solid #cbd5f5",
    fontSize: "15px",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
  },
  footerText: {
    marginTop: "20px",
    textAlign: "center",
    color: "#64748b",
  },
};
