import { skills } from "@/data/resume";
import Reveal from "./Reveal";
import Section from "./Section";

// Rave-flyer blocks: each group gets its own fill; the big frameworks list stays on the dark canvas
const styles = [
  { tile: "bg-mint text-black", chip: "border-black/40" },
  { tile: "tile text-white", chip: "border-frame text-soft" },
  { tile: "bg-uv text-white", chip: "border-white/50" },
  { tile: "bg-yellow text-black", chip: "border-black/40" },
];

export default function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Toolkit"
      title={
        <>
          The <span className="text-mint">stack</span>.
        </>
      }
    >
      <div className="grid gap-3 md:grid-cols-2">
        {skills.map((g, i) => {
          const s = styles[i % styles.length];
          return (
            <Reveal key={g.group} delay={i * 0.06} className={`rounded-[24px] p-7 sm:p-8 ${s.tile}`}>
              <p className="kicker mb-2 opacity-70">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mb-6 text-[2.125rem] leading-none font-bold">{g.group}</h3>
              <ul className="flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <li key={item} className={`pill border ${s.chip}`}>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
