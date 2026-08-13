import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PrejoinPage } from "./pages/PrejoinPage";
import { RoomPage } from "./pages/RoomPage";

const LandingPage = () => (
  <div style={{ padding: "3rem", textAlign: "center", fontFamily: "sans-serif" }}>
    <h1>LiveSession</h1>
    <p style={{ color: "#555" }}>Real-time video collaboration powered by LiveKit Cloud.</p>

    <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
      <a
        href="/prejoin?room=demo-room&role=host"
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#0070f3",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "6px",
          fontWeight: "bold",
        }}
      >
        Create Session (Host)
      </a>

      <a
        href="/prejoin?room=demo-room&role=visitor"
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#333",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "6px",
          fontWeight: "bold",
        }}
      >
        Join Session (Visitor)
      </a>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/prejoin" element={<PrejoinPage />} />
        <Route path="/room" element={<RoomPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}