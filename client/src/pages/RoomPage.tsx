import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  useParticipants,
  useConnectionState,
} from "@livekit/components-react";
import "@livekit/components-styles";
import type { LocalUserChoices } from "@livekit/components-react";
import type { ConnectionState } from "livekit-client";
import type { ParticipantRole } from "../types";

interface RoomLocationState {
  token: string;
  serverUrl: string;
  userChoices: LocalUserChoices;
  role: ParticipantRole;
  roomName: string;
}

const RoomHeader: React.FC<{ roomName: string; role: ParticipantRole }> = ({
  roomName,
  role,
}) => {
  const participants = useParticipants();
  const connectionState: ConnectionState = useConnectionState();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem 1rem",
        backgroundColor: "#1e1e1e",
        color: "#fff",
        borderRadius: "8px",
        marginBottom: "1rem",
      }}
    >
      <div>
        <h3 style={{ margin: 0 }}>Room: {roomName}</h3>
        <small style={{ color: "#aaa" }}>
          Role: <strong>{role.toUpperCase()}</strong> | Status:{" "}
          <span style={{ color: connectionState === "connected" ? "#4caf50" : "#ff9800" }}>
            {connectionState}
          </span>
        </small>
      </div>

      <div>
        <strong>Participants ({participants.length}):</strong>
        <ul
          style={{
            margin: "0.25rem 0 0 0",
            padding: 0,
            listStyle: "none",
            fontSize: "0.85rem",
            color: "#ccc",
          }}
        >
          {participants.map((p) => {
            let pRole = "visitor";
            try {
              if (p.metadata) {
                const parsed = JSON.parse(p.metadata);
                if (parsed.role) pRole = parsed.role;
              }
            } catch {
              // Ignore metadata parse error
            }

            return (
              <li key={p.sid || p.identity}>
                {p.identity} {p.isLocal ? "(You)" : ""} — <em>{pRole}</em>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
};

export const RoomPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as RoomLocationState | null;

  if (!state || !state.token || !state.serverUrl) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>No active session token found.</p>
        <button onClick={() => navigate("/")}>Go to Home</button>
      </div>
    );
  }

  const { token, serverUrl, userChoices, role, roomName } = state;

  const handleDisconnected = () => {
    navigate("/");
  };

  const handleError = (error: Error) => {
    console.error("LiveKit Room Error:", error);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", padding: "1rem" }}>
      <LiveKitRoom
        video={userChoices.videoEnabled}
        audio={userChoices.audioEnabled}
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        onDisconnected={handleDisconnected}
        onError={handleError}
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <RoomHeader roomName={roomName} role={role} />

        <div style={{ flex: 1, position: "relative" }}>
          <VideoConference />
        </div>

        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
};