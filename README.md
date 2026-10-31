# CAPRI AI — starter 0.1

A mobile-first PWA starter for an iPhone cyberpunk companion. This is a scaffold, not a finished AI service.

## What works in this starter
- Mobile chat interface
- Conversation history and editable memory saved in this browser's local storage
- Browser speech synthesis (the available Polish iOS voice; not the original character voice)
- Speech input where supported; iPhone keyboard dictation is an alternative
- Installable PWA shell

## What is not wired yet
- A real AI provider: configure `AI_ENDPOINT`, `AI_API_KEY`, and `AI_MODEL` on a trusted server host.
- Push notifications / autonomous check-ins: requires a push service, a server and explicit permission.
- Cross-device synced memory: requires a database and account/authentication.
- Character artwork and licensed voice assets: use only assets you have permission to use.

## Run
Requires Node.js 20+:
1. `npm install`
2. Set the three AI environment variables on the server (copy `.env.example` as a guide).
3. `npm start`

The server expects an OpenAI-compatible `/v1/chat/completions` endpoint. Keep API keys on the server, never in the browser.

## iPhone
Deploy the app on HTTPS hosting, open its URL in Safari, then Share → Add to Home Screen. iOS PWA support varies by feature and version. Background execution is limited; reliable proactive messages require web push and server-side scheduling.

## Character / rights
Unofficial fan-made companion concept. Not affiliated with CD PROJEKT RED, Studio Trigger or Netflix. Do not clone or impersonate a real actor's voice without explicit permission. The starter uses a written personality inspired by broad fictional traits, not copied dialogue or a voice recording.
