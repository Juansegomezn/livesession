# LiveSession

Real-time 1:1 and multi-participant video sessions built on LiveKit Cloud, with a host/visitor role model enforced at the token level.

## Features

- Backend endpoint that mints LiveKit access tokens — the API secret never reaches the browser.
- Pre-join screen with live camera/microphone preview (LiveKit's official `<PreJoin>` component).
- Create a session (host) or join one with a room name (visitor).
- Two-way audio/video, multi-participant.
- Mute/unmute mic, enable/disable camera, leave — via LiveKit's official `<VideoConference>` component.
- Live participant list with role badges (host/visitor), sourced from signed token metadata.
- Basic connection-state indicator (connected / reconnecting / disconnected).

## Architecture

```
Browser (React)
   │  POST /api/token { roomName, participantName, role }
   ▼
Express backend
   │  validates input → builds AccessToken with role-based grants
   ▼
LiveKit Cloud (SFU)
   │  browser connects directly using the signed token + serverUrl
   ▼
Browser (React) — audio/video/data flow through LiveKit Cloud
```

The backend is the **only** place that holds `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET`. The frontend only ever receives a short-lived signed JWT and the public LiveKit URL.

## Tech Stack

- **Frontend**: React + TypeScript + Vite, `@livekit/components-react`, `livekit-client`, `react-router-dom`.
- **Backend**: Node.js + TypeScript + Express, `livekit-server-sdk`.
- **Infra**: LiveKit Cloud (no self-hosted media server).

## Requirements

- Node.js 18+
- A free LiveKit Cloud project (cloud.livekit.io) → API Key, API Secret, WebSocket URL.

## Environment Variables

See `server/.env.example.` In short:

| Var | Where | Secret? | Purpose |
|---|---|---|---|
| `LIVEKIT_API_KEY` | `server/.env` | yes | Identifies the LiveKit project when signing tokens |
| `LIVEKIT_API_SECRET` | `server/.env` | **yes, never expose** | Signs the JWT access token |
| `LIVEKIT_URL` | `server/.env` | no | LiveKit Cloud WebSocket URL, sent to the client |
| `PORT` | `server/.env` | no | Port for the Express server |
| `CLIENT_ORIGIN` | `server/.env` | no | Allowed CORS origin(s) |
| `VITE_API_URL` | `client/.env` (optional) | no | Only needed if backend isn't on `localhost:3001` |

## Local Setup

```bash
# 1. Backend
cd server
npm install
cp .env.example .env    # then fill in LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL
npm run dev                # http://localhost:3001

# 2. Frontend (new terminal)
cd client
npm install
npm run dev                 # http://localhost:5173
```

Open `http://localhost:5173` in two different browser profiles/tabs (or one normal + one incognito) to simulate host + visitor.

## How LiveKit authentication works

The browser never talks to LiveKit with credentials it can be trusted with. Instead:

1. The client asks our backend for a token (`roomName`, `participantName`, `role`).
2. The backend validates the input and uses `livekit-server-sdk`'s `AccessToken` to build and **sign** a JWT with `LIVEKIT_API_SECRET`.
3. Only that signed JWT (plus the public `LIVEKIT_URL`) goes back to the browser.
4. The browser connects to LiveKit Cloud directly with that JWT. LiveKit's own servers verify the signature — our backend is never in the media path.

This is why token generation must happen server-side: signing requires the secret, and the secret must never exist in any code that ships to a browser.

## Host vs. Visitor

Role enforcement happens in the token's **grant**, not in the UI:

```ts
const grant: VideoGrant = {
  room: roomName,
  roomJoin: true,
  canPublish: true,
  canSubscribe: true,
  canPublishData: true,
  roomAdmin: role === "host",
};
```

`roomAdmin: true` is what would unlock server-authorized moderation actions (mute/remove participants via `RoomServiceClient`) for that identity — LiveKit's SFU checks this against the signed token, so a visitor cannot grant themselves host powers by editing client-side state. The role is also embedded in the token's `metadata`, so every participant can render an accurate "Host"/"Visitor" badge for others, because that value was set by the server after validation — not claimed by the peer.

**Assumption documented**: for this MVP, both host and visitor manually type the same room name to join (no auto-generated invite link/code). A production version would have the host receive a generated room code/link to share, but the join *mechanics* — how a role gets mapped to permissions — are what's actually being validated here, and those are fully implemented and enforced.

## Reconnection

LiveKit's client SDK handles the actual reconnection logic (ICE restarts, renegotiation) internally — we don't reimplement any of that. The app only needs to react to connection state changes via `useConnectionState()` from `@livekit/components-react`, which we surface as a small status label in the room header (`connected` / `reconnecting` / `disconnected`).

## Security considerations

- `LIVEKIT_API_SECRET` only exists in `server/.env` (gitignored) and is read once at process start.
- The `/api/token` route validates `roomName`, `participantName`, and `role` before generating anything; invalid role values are rejected outright.
- Tokens are short-lived (10 minutes) — a fresh one is requested on every join rather than reusing a long-lived token.
- CORS is locked to `CLIENT_ORIGIN`, not left open to any origin.
- Errors are logged server-side but the client only ever receives a generic message — no internals or secret-derived values leak in responses.

## Tradeoffs (given the timebox)

Not implemented, intentionally, to keep the core communication path solid:

- No generated room codes/invite links (see assumption above).
- No persistence (rooms/participants are entirely LiveKit-managed, nothing in a DB).
- No chat, screen share, or host moderation UI — the `roomAdmin` grant is already in place for a future moderation feature, just not wired to any UI action yet.
- No automated tests — prioritized a working, manually-verified real-time path over test scaffolding given the time budget.

## Future improvements

- Real authentication (the `role` is currently trusted from the join request itself, validated only for shape/format — a production app would tie it to an authenticated user/session, e.g. only the account that created the room can request a host token for it).
- Auto-generated room codes + shareable invite links.
- Host moderation UI (mute/remove participant) using the `roomAdmin` grant already issued.
- Persistent session history / database.
- Observability: structured logs, LiveKit webhooks for room/participant events, basic metrics.