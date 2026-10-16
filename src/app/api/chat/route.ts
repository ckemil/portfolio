import { ApiError, GoogleGenAI, ThinkingLevel, type ContentListUnion } from "@google/genai";
import { systemInstruction } from "@/lib/chatPrompt";

type ChatMessage = { from: "user" | "bot"; text: string };
type Started = { model: string; stream: AsyncGenerator<{ text?: string }>; first: string };

const MAX_MESSAGES = 10;
const MAX_QUESTION_CHARS = 500;
// Bot answers in the history can be long (e.g. the keyword bot's skills list), so trim rather than reject
const MAX_ANSWER_CHARS = 2000;
// If a model hasn't started answering by then, also start the next one and keep whichever answers first
const HEDGE_DELAY_MS = 10_000;
// Give up on every model after this, so the widget can fall back to its keyword answers
const TOTAL_TIMEOUT_MS = 25_000;

function parse(body: unknown): ChatMessage[] | null {
  const messages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messages) || messages.length === 0) return null;
  const valid = messages.every(
    (m) =>
      (m?.from === "user" || m?.from === "bot") &&
      typeof m.text === "string" &&
      m.text.trim().length > 0 &&
      (m.from === "bot" || m.text.length <= MAX_QUESTION_CHARS),
  );
  if (!valid || messages.at(-1).from !== "user") return null;
  return messages
    .slice(-MAX_MESSAGES)
    .map((m: ChatMessage) => (m.from === "bot" ? { ...m, text: m.text.slice(0, MAX_ANSWER_CHARS) } : m));
}

// Starts models in order and resolves with the first one to produce text. A model that fails
// starts the next right away; one that's slow gets company after HEDGE_DELAY_MS but keeps running.
function firstToAnswer(ai: GoogleGenAI, models: string[], contents: ContentListUnion) {
  return new Promise<{ started: Started | null; lastError: unknown }>((resolve) => {
    const pending = new Set<AbortController>();
    let next = 0;
    let done = false;
    let lastError: unknown;

    const finish = (started: Started | null) => {
      done = true;
      clearTimeout(deadline);
      for (const c of pending) c.abort();
      resolve({ started, lastError });
    };
    const deadline = setTimeout(() => {
      console.error(`Gemini: no model answered within ${TOTAL_TIMEOUT_MS / 1000}s`);
      finish(null);
    }, TOTAL_TIMEOUT_MS);

    const launch = () => {
      if (done) return;
      if (next >= models.length) {
        if (pending.size === 0) finish(null);
        return;
      }
      const model = models[next++];
      const controller = new AbortController();
      pending.add(controller);
      const hedge = setTimeout(() => {
        console.warn(`Gemini: ${model} slow after ${HEDGE_DELAY_MS / 1000}s, also trying the next model`);
        launch();
      }, HEDGE_DELAY_MS);

      (async () => {
        const stream = await ai.models.generateContentStream({
          model,
          contents,
          config: {
            abortSignal: controller.signal,
            systemInstruction,
            temperature: 0.3,
            // Safety net only (thinking tokens count toward it); the prompt keeps answers short
            maxOutputTokens: 1024,
            // Little reasoning needed to answer from a resume. Lite models accept MINIMAL (no
            // thinking, fastest); full Flash models reject it with a 400, so they get LOW.
            thinkingConfig: { thinkingLevel: model.includes("lite") ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW },
          },
        });
        const { value } = await stream.next();
        return { model, stream, first: value?.text ?? "" };
      })().then(
        (started) => {
          clearTimeout(hedge);
          pending.delete(controller);
          // A slower model that finished after the winner: cancel it
          if (done) return controller.abort();
          finish(started);
        },
        (error) => {
          clearTimeout(hedge);
          pending.delete(controller);
          if (done || controller.signal.aborted) return;
          console.error(`Gemini request failed (${model})`, error);
          lastError = error;
          // Still-running attempts have their own hedge timers, so only fill the gap when none are left
          if (pending.size === 0) launch();
        },
      );
    };

    launch();
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return new Response("Chat is not configured", { status: 503 });

  const messages = parse(await request.json().catch(() => null));
  if (!messages) return new Response("Invalid request", { status: 400 });

  // Gemini expects the conversation to start with a user turn
  const firstUser = messages.findIndex((m) => m.from === "user");
  const contents = messages.slice(firstUser).map((m) => ({
    role: m.from === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));

  // Comma-separated, tried in order: free-tier models often return 503 under high demand.
  // Lite models first: they're faster and plenty for resume Q&A.
  const models = (process.env.GEMINI_MODEL || "gemini-flash-lite-latest,gemini-3.5-flash-lite,gemini-flash-latest")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  const { started, lastError } = await firstToAnswer(new GoogleGenAI({ apiKey }), models, contents);
  if (!started) {
    const status = lastError instanceof ApiError && lastError.status === 429 ? 429 : 502;
    return new Response("Chat is unavailable", { status });
  }

  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          if (started.first) controller.enqueue(encoder.encode(started.first));
          for await (const chunk of started.stream) {
            if (chunk.text) controller.enqueue(encoder.encode(chunk.text));
          }
        } catch (error) {
          console.error(`Gemini stream failed (${started.model})`, error);
        }
        controller.close();
      },
    }),
    { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } },
  );
}
