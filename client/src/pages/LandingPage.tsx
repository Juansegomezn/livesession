import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("demo-room");

  const handleStartSession = (role: "host" | "visitor") => {
    const targetRoom = roomName.trim() || "demo-room";
    navigate(`/prejoin?room=${encodeURIComponent(targetRoom)}&role=${role}`);
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "4rem auto",
        padding: "2rem",
        textAlign: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        border: "1px solid #333",
        borderRadius: "12px",
        backgroundColor: "#121212",
        color: "#f5f5f5",
      }}
    >
      <h1 style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>LiveSession</h1>
      <p style={{ color: "#aaa", marginBottom: "2rem" }}>
        Real-time immersive video sessions powered by LiveKit Cloud.
      </p>

      <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
        <label
          htmlFor="room-input"
          style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#ccc" }}
        >
          Room Name or Session ID:
        </label>
        <input
          id="room-input"
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="e.g. demo-room"
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #444",
            backgroundColor: "#1e1e1e",
            color: "#fff",
            fontSize: "1rem",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button
          onClick={() => handleStartSession("host")}
          style={{
            flex: 1,
            padding: "0.85rem",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          Create Session (Host)
        </button>

        <button
          onClick={() => handleStartSession("visitor")}
          style={{
            flex: 1,
            padding: "0.85rem",
            backgroundColor: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          Join Session (Visitor)
        </button>
      </div>
    </div>
  );
};