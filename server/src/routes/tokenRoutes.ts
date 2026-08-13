import { Router, Request, Response } from "express";
import { generateLiveKitToken } from "../services/livekitTokenService.js";
import { TokenRequest, TokenResponse, ApiErrorResponse } from "../types/index.js";

const router = Router();

router.post(
  "/token",
  async (
    req: Request<{}, {}, TokenRequest>,
    res: Response<TokenResponse | ApiErrorResponse>
  ): Promise<void> => {
    try {
      const { roomName, participantName, role } = req.body;

      if (!roomName || typeof roomName !== "string" || roomName.trim().length === 0) {
        res.status(400).json({ error: "Invalid or missing 'roomName'." });
        return;
      }

      if (
        !participantName ||
        typeof participantName !== "string" ||
        participantName.trim().length === 0
      ) {
        res.status(400).json({ error: "Invalid or missing 'participantName'." });
        return;
      }

      if (role !== "host" && role !== "visitor") {
        res.status(400).json({ error: "Role must be either 'host' or 'visitor'." });
        return;
      }

      const serverUrl = process.env.LIVEKIT_URL;
      if (!serverUrl) {
        res.status(500).json({ error: "Server environment misconfiguration: LIVEKIT_URL missing." });
        return;
      }

      const token = await generateLiveKitToken({
        roomName: roomName.trim(),
        participantName: participantName.trim(),
        role,
      });

      res.status(200).json({
        token,
        serverUrl,
      });
    } catch (error) {
      console.error("Error generating LiveKit token:", error);
      res.status(500).json({ error: "Failed to generate access token." });
    }
  }
);

export default router;