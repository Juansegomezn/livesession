import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PreJoin } from "@livekit/components-react";
import type { LocalUserChoices } from "@livekit/components-react";
import "@livekit/components-styles";
import { fetchLiveKitToken } from "../services/apiService";
import type { ParticipantRole } from "../types";

export const PrejoinPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const roomName = searchParams.get("room") || "demo-room";
  const role = (searchParams.get("role") as ParticipantRole) || "visitor";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePreJoinSubmit = async (values: LocalUserChoices) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const { token, serverUrl } = await fetchLiveKitToken({
        roomName,
        participantName: values.username || "Guest",
        role,
      });

      navigate("/room", {
        state: {
          token,
          serverUrl,
          userChoices: values,
          role,
          roomName,
        },
      });
    } catch (err: any) {
      console.error("Error joining session:", err);
      setErrorMessage(err.message || "Could not connect to session.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h2>LiveSession — Audio & Video Setup</h2>
      <p style={{ color: "#666" }}>
        Joining <strong>{roomName}</strong> as <strong>{role.toUpperCase()}</strong>
      </p>

      {errorMessage && (
        <div style={{ color: "red", marginBottom: "1rem", padding: "0.5rem", border: "1px solid red", borderRadius: "4px" }}>
          {errorMessage}
        </div>
      )}

      {isSubmitting ? (
        <p>Connecting & generating secure token...</p>
      ) : (
        <PreJoin
          onSubmit={handlePreJoinSubmit}
          defaults={{
            username: "",
            videoEnabled: true,
            audioEnabled: true,
          }}
        />
      )}
    </div>
  );
};