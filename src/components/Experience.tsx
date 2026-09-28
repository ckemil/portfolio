import { experience } from "@/data/resume";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title={
        <>
          Where I&apos;ve <span className="text-gradient">shipped</span>.
        </>
      }
    >
      <ol className="relative space-y-10 border-l border-white/10 pl-6 sm:pl-10">
        {experience.map((job, i) => (
          <li key={job.company} className="relative">
            <span
              aria-hidden
              className="absolute top-2 -left-[31px] h-3 w-3 rounded-full bg-gradient-to-br from-violet to-cyan ring-4 ring-background sm:-left-[47px]"
            />
            <Reveal delay={i * 0.05} className="glass glow rounded-3xl p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-display text-2xl font-bold sm:text-3xl">{job.role}</h3>
                <span className="font-display text-sm tracking-wide text-cyan">{job.period}</span>
              </div>
              <p className="mt-1 text-muted">
                {job.company} · {job.location}
              </p>
              <ul className="mt-5 space-y-2.5">
                {job.highlights.map((h) => (
                  <li key={h} className="flex gap-3 leading-relaxed text-foreground/85">
                    <span aria-hidden className="mt-2.5 h-1 w-3 shrink-0 rounded-full bg-violet" />
                    {h}
                  </li>
                ))}
              </ul>
              <ul className="mt-6 flex flex-wrap gap-2">
                {job.tech.map((t) => (
                  <li key={t} className="rounded-md bg-white/5 px-2.5 py-1 font-mono text-xs text-muted">
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
