"use client";

import { AnimatePresence, m } from "framer-motion";
import { Play, RotateCcw, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import Section from "./Section";
import { useInView } from "@/lib/useInView";

// Stack Overflow — drop each layer of your tech stack on the one below.
// Only the overlapping part survives; miss completely and the tower falls.

type Block = { id: number; x: number; w: number; c: number; label: string };
type Piece = Block & { level: number; dir: 1 | -1 };
type Phase = "idle" | "playing" | "over";

const BLOCK_H = 30; // px
const BASE_W = 56; // % of arena width
const PERFECT = 1.5; // % tolerance for a perfect drop
const BEST_KEY = "stack-overflow-best";

const COLORS = [
  "bg-mint text-black",
  "bg-uv text-white",
  "bg-yellow text-black",
  "bg-pink text-black",
  "bg-orange text-black",
  "bg-white text-black",
];

const LABELS = [
  "Spring Boot",
  "Kafka",
  "Docker",
  "Kubernetes",
  "PostgreSQL",
  "Another YAML file",
  "RabbitMQ",
  "Hibernate",
  "Hotfix (don't ask)",
  "Microservice #47",
  "TODO: refactor",
  "Legacy monolith",
  "NGINX",
  "Friday deploy",
  "Retry with backoff",
  "Circuit breaker",
  "Undocumented cron job",
  "Liquibase migration #312",
];

const MILESTONES: Record<number, string> = {
  5: "Works on my machine ✓",
  10: "Promoted to Senior Stacker",
  15: "Architect mode: now drawing boxes",
  20: "Kubernetes needs its own Kubernetes",
  25: "More layers than your YAML",
  30: "Legend. Go update LinkedIn.",
};

const CRASHES = [
  "java.lang.StackOverflowError",
  "It worked in staging.",
  "Production is down. Who deployed on Friday?",
  "NullPointerException: tower was null",
  "Have you tried turning it off and on again?",
  "Git blame says… you.",
];

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBest(score: number) {
  try {
    localStorage.setItem(BEST_KEY, String(score));
  } catch {
    /* storage blocked — the best score just won't persist */
  }
}

let nextId = 0;
const baseBlock = (): Block => ({ id: nextId++, x: (100 - BASE_W) / 2, w: BASE_W, c: 0, label: "main()" });

export default function Game() {
  const arenaRef = useRef<HTMLDivElement>(null);
  const movingRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, dir: 1 as 1 | -1 });
  const inView = useInView(arenaRef);

  const [phase, setPhase] = useState<Phase>("idle");
  const [blocks, setBlocks] = useState<Block[]>(() => [baseBlock()]);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [combo, setCombo] = useState(0);
  const [best, setBest] = useState(0);
  const [newBest, setNewBest] = useState(false);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const [crash, setCrash] = useState("");
  const [arenaH, setArenaH] = useState(460);

  const score = blocks.length - 1;
  const top = blocks[blocks.length - 1];
  const speed = Math.min(30 + score * 2, 95); // % of width per second
  // Scroll the tower down once it passes ~55% of the arena
  const camera = Math.max(0, (blocks.length + 1) * BLOCK_H - arenaH * 0.55);

  useEffect(() => {
    const el = arenaRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setArenaH(e.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Slide the moving layer back and forth
  useEffect(() => {
    if (phase !== "playing") return;
    let frame = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const p = pos.current;
      p.x += p.dir * speed * dt;
      if (p.x <= 0) {
        p.x = 0;
        p.dir = 1;
      } else if (p.x >= 100 - top.w) {
        p.x = 100 - top.w;
        p.dir = -1;
      }
      if (movingRef.current) movingRef.current.style.left = `${p.x}%`;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [phase, speed, top.w]);

  const showToast = (text: string) => {
    const id = nextId++;
    setToast({ id, text });
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 1600);
  };

  const start = () => {
    setBest(readBest());
    setNewBest(false);
    setBlocks([baseBlock()]);
    setPieces([]);
    setCombo(0);
    setToast(null);
    setCrash("");
    pos.current = { x: 0, dir: 1 };
    setPhase("playing");
  };

  const drop = () => {
    if (phase !== "playing") return;
    const n = blocks.length;
    const x = pos.current.x;
    const w = top.w;
    const c = n % COLORS.length;
    const label = LABELS[(n - 1) % LABELS.length];
    const left = Math.max(x, top.x);
    const overlap = Math.min(x + w, top.x + top.w) - left;

    if (overlap <= 0.5) {
      setPieces((p) => [...p, { id: nextId++, x, w, c, label, level: n, dir: x < top.x ? -1 : 1 }]);
      setCrash(CRASHES[Math.floor(Math.random() * CRASHES.length)]);
      const stored = readBest();
      if (score > stored) {
        saveBest(score);
        setNewBest(true);
      }
      setBest(Math.max(stored, score));
      setPhase("over");
      return;
    }

    let block: Block;
    if (Math.abs(x - top.x) < PERFECT) {
      const streak = combo + 1;
      setCombo(streak);
      // Three perfect drops in a row win some width back
      const grow = streak >= 3 ? Math.min(2, BASE_W - top.w) : 0;
      block = { id: nextId++, x: Math.max(0, top.x - grow / 2), w: top.w + grow, c, label };
      showToast(streak >= 3 ? `Perfect ×${streak} — stack grows!` : "Perfect!");
    } else {
      setCombo(0);
      block = { id: nextId++, x: left, w: overlap, c, label };
      const cut =
        x < top.x
          ? { x, w: top.x - x, dir: -1 as const }
          : { x: top.x + top.w, w: x + w - (top.x + top.w), dir: 1 as const };
      setPieces((p) => [...p, { id: nextId++, ...cut, c, label, level: n }]);
    }

    const height = n; // score after this drop
    if (MILESTONES[height]) showToast(MILESTONES[height]);
    setBlocks((b) => [...b, block]);
    // Next layer enters from alternating sides
    pos.current = n % 2 ? { x: 100 - block.w, dir: -1 } : { x: 0, dir: 1 };
  };

  // Space / Enter drops while the game is on screen
  useEffect(() => {
    if (phase !== "playing" || !inView) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        drop();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const shownBest = Math.max(best, phase === "over" ? score : 0);

  return (
    <Section
      id="play"
      eyebrow="Take a break"
      title={
        <>
          Stack <span className="text-mint">Overflow</span>.
        </>
      }
    >
      <Reveal>
        <div className="kicker mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="pill bg-mint text-black">Height {score}</span>
            {combo >= 2 && phase === "playing" && <span className="pill bg-yellow text-black">Perfect ×{combo}</span>}
          </div>
          {shownBest > 0 && (
            <span className="inline-flex items-center gap-1.5 text-muted">
              <Trophy className="h-4 w-4 text-yellow" /> Best {shownBest}
            </span>
          )}
        </div>

        <div
          ref={arenaRef}
          onPointerDown={drop}
          className={`tile relative h-[420px] touch-manipulation overflow-hidden rounded-[24px]! select-none sm:h-[480px] ${
            phase === "playing" ? "cursor-pointer" : ""
          }`}
        >
          {/* Tower — shifted down as it grows so the top stays in view */}
          <div
            className="absolute inset-x-0 bottom-0 transition-transform duration-300 ease-out"
            style={{ transform: `translateY(${camera}px)` }}
          >
            {blocks.map((b, i) => (
              <Layer key={b.id} block={b} bottom={i * BLOCK_H} />
            ))}

            {phase === "playing" && (
              <div
                ref={movingRef}
                className={`absolute flex items-center justify-center overflow-hidden rounded-[4px] ${COLORS[blocks.length % COLORS.length]}`}
                style={{ bottom: blocks.length * BLOCK_H, width: `${top.w}%`, height: BLOCK_H - 2 }}
              >
                {top.w > 16 && <span className="meta truncate px-2">{LABELS[(blocks.length - 1) % LABELS.length]}</span>}
              </div>
            )}

            <AnimatePresence>
              {pieces.map((p) => (
                <m.div
                  key={p.id}
                  initial={{ y: 0, rotate: 0, opacity: 1 }}
                  animate={{ y: 420, rotate: p.dir * 35, opacity: 0 }}
                  transition={{ duration: 1, ease: "easeIn" }}
                  onAnimationComplete={() => setPieces((ps) => ps.filter((x) => x.id !== p.id))}
                  className={`absolute rounded-[4px] ${COLORS[p.c]}`}
                  style={{ left: `${p.x}%`, width: `${p.w}%`, bottom: p.level * BLOCK_H, height: BLOCK_H - 2 }}
                />
              ))}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {toast && phase === "playing" && (
              <m.p
                key={toast.id}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="pill absolute top-5 left-1/2 -translate-x-1/2 bg-white whitespace-nowrap text-black"
              >
                {toast.text}
              </m.p>
            )}
          </AnimatePresence>

          {phase !== "playing" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-canvas/95 px-6 text-center">
              {phase === "over" ? (
                <>
                  <p className="pill bg-uv text-white normal-case">{crash}</p>
                  <p className="display text-[6.69rem] text-mint">{score}</p>
                  <p className="kicker -mt-3 text-muted">layers stacked</p>
                  {newBest && <span className="pill bg-yellow text-black">New personal best</span>}
                </>
              ) : (
                <p className="max-w-md leading-[1.6] font-medium text-soft">
                  Your tech stack is getting tall. Tap — or press <span className="pill border border-frame">Space</span> —
                  to drop each layer. Only the overlap survives. Perfect drops keep your width; miss completely and
                  it&apos;s a <span className="font-bold text-mint">StackOverflowError</span>.
                </p>
              )}
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={start}
                className="btn btn-primary"
              >
                {phase === "over" ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {phase === "over" ? "Try again" : "Start stacking"}
              </button>
            </div>
          )}
        </div>
      </Reveal>
    </Section>
  );
}

function Layer({ block, bottom }: { block: Block; bottom: number }) {
  return (
    <m.div
      initial={{ scaleY: 0.4, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{ duration: 0.15 }}
      className={`absolute flex origin-bottom items-center justify-center overflow-hidden rounded-[4px] ${COLORS[block.c]}`}
      style={{ left: `${block.x}%`, width: `${block.w}%`, bottom, height: BLOCK_H - 2 }}
    >
      {block.w > 16 && <span className="meta truncate px-2">{block.label}</span>}
    </m.div>
  );
}
