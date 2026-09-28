"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { stats } from "@/data/resume";
import Reveal from "./Reveal";

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: reduce ? 0 : 1.6,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="glass glow rounded-3xl p-6 sm:p-8">
            <div className="text-gradient font-display text-5xl font-bold sm:text-6xl">
              <Counter to={s.value} suffix={s.suffix} />
            </div>
            <p className="mt-3 text-sm text-muted">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
