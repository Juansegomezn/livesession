import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PrejoinPage } from "./pages/PrejoinPage";

const LandingPage = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>LiveSession</h1>
    <p>Real-time video sessions.</p>
    <div style={{ marginTop: "1rem" }}>
      <a href="/prejoin?room=demo-room&role=host" style={{ marginRight: "1rem" }}>
        Create Session (Host)
      </a>
      <a href="/prejoin?room=demo-room&role=visitor">Join Session (Visitor)</a>
    </div>
  </div>
);

const RoomPlaceholder = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h2>Room View Placeholder</h2>
    <p>Connecting to LiveKit Cloud...</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/prejoin" element={<PrejoinPage />} />
        <Route path="/room" element={<RoomPlaceholder />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}