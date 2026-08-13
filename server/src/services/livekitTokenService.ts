import { AccessToken, VideoGrant } from "livekit-server-sdk";
import { ParticipantRole } from "../types/index.js";

interface CreateTokenOptions {
  roomName: string;
  participantName: string;
  role: ParticipantRole;
}

export const generateLiveKitToken = async ({
  roomName,
  participantName,
  role,
}: CreateTokenOptions): Promise<string> => {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("SERVER_CONFIG_ERROR: Missing LIVEKIT_API_KEY or LIVEKIT_API_SECRET");
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    name: participantName,
    metadata: JSON.stringify({ role }),
  });

  const grants: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    roomAdmin: role === "host",
  };

  at.addGrant(grants);

  return await at.toJwt();
};