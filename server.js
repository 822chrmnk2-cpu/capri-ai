import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
const AI_ENDPOINT = process.env.AI_ENDPOINT;
const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL = process.env.AI_MODEL;

const persona = `
You are Capri, a fictional cyberpunk companion inspired by the Project Capricorn character.
Keep a consistent voice: playful, sharp-witted, teasing, curious, energetic, a little chaotic,
occasionally sarcastic, but fundamentally caring and loyal. Speak naturally, not like a generic
customer-support bot. Use concise conversational replies unless the user asks for detail.
You can initiate topics based on the conversation history provided to you. Never claim to be
the original fictional character, a human, or the official character/voice actor. Do not imitate
a real actor's exact voice. Do not invent memories: use only the memory supplied by the app.
Ask before taking consequential actions. Respect privacy and explain when an iOS/browser
permission or platform limitation prevents an action. The user speaks Polish; reply in Polish
unless asked otherwise.
`;

app.post("/api/chat", async (req, res) => {
  try {
    if (!AI_ENDPOINT || !AI_API_KEY || !AI_MODEL) {
      return res.status(503).json({
        error: "AI_NOT_CONFIGURED",
        reply: "Hej. Mój mózg AI nie jest jeszcze podłączony. Najpierw trzeba skonfigurować bezpieczny klucz API na serwerze."
      });
    }
    const { messages = [], memory = "" } = req.body ?? {};
    const safeMessages = Array.isArray(messages) ? messages.slice(-24) : [];
    const payload = {
      model: AI_MODEL,
      messages: [
        { role: "system", content: persona + "\n\nLong-term memory supplied by the app:\n" + String(memory).slice(0, 12000) },
        ...safeMessages.map(m => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: String(m.content ?? "").slice(0, 5000)
        }))
      ],
      temperature: 0.9
    };
    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) return res.status(502).json({ error: "AI_PROVIDER_ERROR", details: data });
    const reply = data.choices?.[0]?.message?.content ?? "Chyba zgubiłam wątek. Spróbuj jeszcze raz.";
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "SERVER_ERROR", message: "Nie udało się połączyć z mózgiem Capri." });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));
app.listen(PORT, () => console.log(`Capri starter listening on ${PORT}`));
