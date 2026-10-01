"use client";

import { AnimatePresence, m } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/resume";
import { reply, suggestions, type Answer } from "@/lib/chatbot";

type Message = { id: number; from: "bot" | "user"; answer: Answer };

let nextId = 0;
const welcome: Message = {
  id: nextId++,
  from: "bot",
  answer: { text: `Hi! I'm ${profile.firstName}'s assistant. Ask me anything about his experience, skills or projects.` },
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [value, setValue] = useState("");
  const [typing, setTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q || typing) return;
    setValue("");
    const userMsg: Message = { id: nextId++, from: "user", answer: { text: q } };
    const botMsg: Message = { id: nextId++, from: "bot", answer: reply(q) };
    setMessages((m) => [...m, userMsg]);
    setTyping(true);
    // A short pause so answers feel conversational rather than instant
    setTimeout(() => {
      setMessages((m) => [...m, botMsg]);
      setTyping(false);
    }, 650);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Ask about Emil"}
        className="fixed right-5 bottom-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-mint text-black transition-colors hover:bg-white"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            role="dialog"
            aria-label="Chat about Emil"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed right-4 bottom-20 z-40 flex h-[520px] max-h-[calc(100svh-7rem)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[24px] border border-white bg-canvas"
          >
            <div className="flex items-center gap-3 border-b border-frame px-4 py-3">
              <div className="display flex h-10 w-10 items-center justify-center rounded-full bg-mint text-xl text-black">
                E<span className="text-uv">.</span>
              </div>
              <div className="flex-1">
                <p className="font-bold">Ask about {profile.firstName}</p>
                <p className="meta mt-0.5 text-muted">Answers come from his resume</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="flex h-10 w-10 items-center justify-center rounded-full text-muted hover:text-link">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-[20px] px-4 py-3 text-sm leading-[1.6] font-medium whitespace-pre-line ${
                      m.from === "user" ? "rounded-br-[4px] bg-mint text-black" : "rounded-bl-[4px] bg-slate text-soft"
                    }`}
                  >
                    {m.answer.text}
                    {m.answer.actions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.answer.actions.map((a) => (
                          <a
                            key={a.href}
                            href={a.href}
                            target={a.href.startsWith("http") || a.href.endsWith(".pdf") ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="btn btn-outline min-h-9 px-4 py-1.5 text-[11px]"
                          >
                            {a.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex w-fit gap-1 rounded-[20px] rounded-bl-[4px] bg-slate px-4 py-3.5" aria-label="Typing">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  className="shrink-0 rounded-[20px] border border-frame px-3 py-1.5 text-[13px] whitespace-nowrap text-soft transition-colors hover:border-mint hover:text-mint"
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(value);
              }}
              className="flex items-center gap-2 border-t border-frame p-3"
            >
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ask something…"
                aria-label="Your question"
                className="min-h-11 flex-1 rounded-[2px] border border-muted bg-canvas px-3 text-[15px] transition-colors outline-none placeholder:text-muted focus:border-mint"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!value.trim() || typing}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-mint text-black transition-colors hover:bg-white disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
