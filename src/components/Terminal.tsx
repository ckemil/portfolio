"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TerminalSquare, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { experience, profile, projects, skills, summary } from "@/data/resume";

type Line = { kind: "in" | "out"; text: string };

const welcome: Line[] = [
  { kind: "out", text: `Welcome to ${profile.firstName}'s terminal. Type 'help' to get started.` },
];

const commands: Record<string, string> = {
  help: "list commands",
  whoami: "who is this guy?",
  about: "career summary",
  skills: "tech stack",
  experience: "work history",
  projects: "key projects",
  contact: "how to reach me",
  resume: "open the PDF resume",
  play: "play Stack Overflow",
  "sudo hire-emil": "you know you want to",
  clear: "clear the screen",
  exit: "close the terminal",
};

function run(input: string): string[] | "clear" | "exit" {
  const cmd = input.trim().toLowerCase();
  switch (cmd) {
    case "":
      return [];
    case "help":
      return Object.entries(commands).map(([c, d]) => `  ${c.padEnd(16)} ${d}`);
    case "whoami":
      return [`${profile.name} — ${profile.title}`, `${profile.tagline} · ${profile.location}`];
    case "about":
      return summary.map((s) => `• ${s}`);
    case "skills":
      return skills.map((g) => `${g.group}: ${g.items.join(", ")}`);
    case "experience":
      return experience.map((j) => `${j.period.padEnd(20)} ${j.role} @ ${j.company}`);
    case "projects":
      return projects.flatMap((p) => [`▸ ${p.name} (${p.context})`, `  ${p.summary}`]);
    case "contact":
      return [`email     ${profile.email}`, `linkedin  ${profile.linkedin}`];
    case "resume":
      window.open(profile.resume, "_blank", "noopener");
      return ["Opening resume…"];
    case "play":
      document.getElementById("play")?.scrollIntoView({ behavior: "smooth" });
      return ["Scrolling to Stack Overflow… mind the gap."];
    case "sudo hire-emil":
    case "hire":
      window.location.href = `mailto:${profile.email}?subject=Let's%20talk`;
      return ["[sudo] permission granted ✓", "Opening your mail client…"];
    case "clear":
      return "clear";
    case "exit":
      return "exit";
    default:
      if (cmd.startsWith("sudo")) return ["Nice try. Only 'sudo hire-emil' is allowed here."];
      return [`command not found: ${cmd}. Type 'help'.`];
  }
}

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(welcome);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable;
      if (e.key === "`" && !typing) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const submit = () => {
    const result = run(value);
    if (value.trim()) setHistory((h) => [...h, value]);
    setCursor(-1);
    setValue("");
    if (result === "clear") return setLines([]);
    if (result === "exit") return setOpen(false);
    setLines((l) => [...l, { kind: "in", text: value }, ...result.map((text) => ({ kind: "out" as const, text }))]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submit();
    else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const next = cursor < 0 ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
    } else if (e.key === "ArrowDown" && cursor >= 0) {
      e.preventDefault();
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(-1);
        setValue("");
      } else {
        setCursor(next);
        setValue(history[next]);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle terminal"
        className="fixed bottom-5 left-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-slate text-soft transition-colors hover:bg-white hover:text-black"
      >
        <TerminalSquare className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Terminal"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 bottom-20 z-40 flex h-[380px] flex-col overflow-hidden rounded-[20px] border border-white bg-canvas sm:right-auto sm:w-[560px]"
          >
            <div className="flex items-center gap-2 border-b border-frame px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-pink" />
              <span className="h-3 w-3 rounded-full bg-yellow" />
              <span className="h-3 w-3 rounded-full bg-mint" />
              <span className="meta ml-3 flex-1 text-muted">emil@portfolio: ~</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close terminal" className="flex h-9 w-9 items-center justify-center text-muted hover:text-link">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div
              ref={bodyRef}
              onClick={() => inputRef.current?.focus()}
              className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-6"
            >
              {lines.map((l, i) =>
                l.kind === "in" ? (
                  <div key={i}>
                    <span className="text-mint">➜</span> <span className="text-muted">~</span> {l.text}
                  </div>
                ) : (
                  <div key={i} className="whitespace-pre-wrap text-soft">
                    {l.text}
                  </div>
                ),
              )}
              <div className="flex items-center gap-2">
                <span className="text-mint">➜</span> <span className="text-muted">~</span>
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  aria-label="Terminal input"
                  className="flex-1 bg-transparent caret-mint outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
