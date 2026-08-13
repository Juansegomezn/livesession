import type { FetchTokenParams, FetchTokenResponse } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function fetchLiveKitToken({
  roomName,
  participantName,
  role,
}: FetchTokenParams): Promise<FetchTokenResponse> {
  const response = await fetch(`${API_BASE_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomName, participantName, role }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch LiveKit access token.");
  }

  return response.json();
}