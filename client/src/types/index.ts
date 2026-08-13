export type ParticipantRole = "host" | "visitor";

export interface FetchTokenParams {
  roomName: string;
  participantName: string;
  role: ParticipantRole;
}

export interface FetchTokenResponse {
  token: string;
  serverUrl: string;
}