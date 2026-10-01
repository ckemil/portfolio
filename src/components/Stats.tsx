"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/data/resume";
import { useInView } from "@/lib/useInView";
import Reveal from "./Reveal";

// Saturated colour-block tiles — colour does the elevation, not shadow
const fills = ["bg-mint text-black", "bg-uv text-white", "bg-yellow text-black", "bg-pink text-black"];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1600;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = duration ? Math.min((now - t0) / duration, 1) : 1;
      setN(Math.round(to * (1 - (1 - p) ** 3))); // ease-out cubic
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

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
