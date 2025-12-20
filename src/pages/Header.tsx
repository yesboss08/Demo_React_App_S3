import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>CloudBox</div>

      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/about" style={styles.link}>About</Link>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/signup" style={styles.cta}>Get Started</Link>
      </nav>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 40px",
    borderBottom: "1px solid #e5e7eb",
    background: "#ffffff",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#4f46e5",
  },
  nav: {
    display: "flex",
    gap: "22px",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    color: "#334155",
    fontWeight: 500,
  },
  cta: {
    textDecoration: "none",
    padding: "10px 18px",
    background: "#4f46e5",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: 600,
  },
};
