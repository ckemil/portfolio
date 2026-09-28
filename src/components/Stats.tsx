"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { stats } from "@/data/resume";
import Reveal from "./Reveal";

// Saturated colour-block tiles — colour does the elevation, not shadow
const fills = ["bg-mint text-black", "bg-uv text-white", "bg-yellow text-black", "bg-pink text-black"];

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
    <section className="mx-auto max-w-7xl px-6 md:px-12">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06} className={`rounded-[20px] p-6 sm:p-8 ${fills[i % fills.length]}`}>
            <div className="display text-[clamp(3.75rem,8vw,5.6rem)] leading-[0.9]">
              <Counter to={s.value} suffix={s.suffix} />
            </div>
            <p className="kicker mt-4">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
