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
    <section id={id} className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
      <Reveal>
        <p className="kicker mb-4 text-mint">{eyebrow}</p>
        <h2 className="display mb-12 text-[clamp(3rem,8vw,6.69rem)]">{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}
