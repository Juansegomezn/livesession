import { useNavigate } from "react-router-dom";

export function Landing() {
  const navigate = useNavigate();

  return (
    <main style={styles.wrapper}>
      <h1 style={styles.title}>LiveSession</h1>
      <p style={styles.subtitle}>
        Real-time video sessions. Create one, or join with a code.
      </p>
      <div style={styles.actions}>
        <button style={styles.primaryButton} onClick={() => navigate("/create")}>
          Create Session
        </button>
        <button style={styles.secondaryButton} onClick={() => navigate("/join")}>
          Join Session
        </button>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "1rem",
    textAlign: "center",
  },
  title: { fontSize: "2rem", margin: 0 },
  subtitle: { color: "#9aa0a6", marginTop: 0, marginBottom: "1.5rem" },
  actions: { display: "flex", gap: "0.75rem" },
  primaryButton: {
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    border: "none",
    background: "#4f7cff",
    color: "white",
    fontSize: "1rem",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    border: "1px solid #3a3f4b",
    background: "transparent",
    color: "#e6e6e6",
    fontSize: "1rem",
    cursor: "pointer",
  },
};