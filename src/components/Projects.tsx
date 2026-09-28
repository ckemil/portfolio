import { projects } from "@/data/resume";
import Reveal from "./Reveal";
import Section from "./Section";

const fills = [
  { tile: "bg-uv/90 text-white", chip: "border-white/50", arrow: "text-mint" },
  { tile: "bg-mint text-black", chip: "border-black/40", arrow: "text-uv" },
];

export default function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Key projects"
      title={
        <>
          Selected <span className="text-mint">work</span>.
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((p, i) => {
          const f = fills[i % fills.length];
          return (
            <Reveal key={p.name} delay={i * 0.08} className="h-full">
              <article className={`flex h-full flex-col rounded-[24px] p-8 sm:p-10 ${f.tile}`}>
                <p className="kicker opacity-80">{p.context}</p>
                <h3 className="mt-3 text-[2rem] leading-[1.1] font-bold tracking-[0.32px] sm:text-[2.5rem]">{p.name}</h3>
                <p className="mt-4 text-base leading-[1.6] font-medium opacity-90">{p.summary}</p>
                <ul className="mt-6 space-y-3">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-3 font-medium">
                      <span aria-hidden className={`font-bold ${f.arrow}`}>
                        →
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
                <ul className="mt-auto flex flex-wrap gap-2 pt-8">
                  {p.tech.map((t) => (
                    <li key={t} className={`pill border ${f.chip}`}>
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
