export type ParticipantRole = "host" | "visitor";

export interface TokenResponse {
  token: string;
  serverUrl: string;
}