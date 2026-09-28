import { projects } from "@/data/resume";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Key projects"
      title={
        <>
          Selected <span className="text-gradient">work</span>.
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.1} className="h-full">
            <article className="group glass glow relative flex h-full flex-col overflow-hidden rounded-3xl p-8">
              <div
                aria-hidden
                className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-br from-violet via-pink to-cyan opacity-20 blur-3xl transition-opacity group-hover:opacity-40"
              />
              <p className="font-display text-sm tracking-wide text-cyan">{p.context}</p>
              <h3 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{p.name}</h3>
              <p className="mt-4 leading-relaxed text-muted">{p.summary}</p>
              <ul className="mt-6 space-y-2.5">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-foreground/85">
                    <span aria-hidden className="text-violet">→</span>
                    {h}
                  </li>
                ))}
              </ul>
              <ul className="mt-auto flex flex-wrap gap-2 pt-8">
                {p.tech.map((t) => (
                  <li key={t} className="rounded-md bg-white/5 px-2.5 py-1 font-mono text-xs text-muted">
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
