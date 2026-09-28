import { skills } from "@/data/resume";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Toolkit"
      title={
        <>
          The <span className="text-gradient">stack</span>.
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        {skills.map((g, i) => (
          <Reveal key={g.group} delay={i * 0.08} className="glass glow rounded-3xl p-7">
            <h3 className="mb-5 font-display text-2xl font-bold">{g.group}</h3>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm transition-colors hover:border-cyan/60 hover:text-cyan"
                >
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
