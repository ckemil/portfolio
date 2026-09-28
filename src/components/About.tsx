import { summary } from "@/data/resume";
import Reveal from "./Reveal";
import Section from "./Section";

export default function About() {
  return (
    <Section
      id="about"
      eyebrow="About"
      title={
        <>
          Building systems that <span className="text-gradient">don&apos;t blink</span> under load.
        </>
      }
    >
      <ul className="grid gap-4 md:grid-cols-2">
        {summary.map((line, i) => (
          <Reveal key={line} delay={i * 0.06}>
            <li className="glass glow flex h-full gap-4 rounded-2xl p-6">
              <span className="font-display text-sm font-bold text-violet">{String(i + 1).padStart(2, "0")}</span>
              <p className="leading-relaxed text-foreground/85">{line}</p>
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
