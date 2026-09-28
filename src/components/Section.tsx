import type { ReactNode } from "react";
import Reveal from "./Reveal";

export default function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <Reveal>
        <p className="mb-3 font-display text-sm font-medium tracking-[0.3em] text-cyan uppercase">{eyebrow}</p>
        <h2 className="mb-14 font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] font-bold tracking-tight">
          {title}
        </h2>
      </Reveal>
      {children}
    </section>
  );
}
