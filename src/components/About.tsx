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
          Building systems that <span className="text-mint">don&apos;t blink</span> under load.
        </>
      }
    >
      <ul className="grid gap-3 md:grid-cols-2">
        {summary.map((line, i) => (
          <Reveal key={line} delay={i * 0.05}>
            <li className="tile flex h-full gap-5 p-6 sm:p-7">
              <span className="kicker pt-1 text-mint">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-base leading-[1.6] font-medium text-soft">{line}</p>
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
