export type ParticipantRole = "host" | "visitor";

export interface TokenRequest {
  roomName: string;
  participantName: string;
  role: ParticipantRole;
}

export interface TokenResponse {
  token: string;
  serverUrl: string;
}

export interface ApiErrorResponse {
  error: string;
}