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
          Where I&apos;ve <span className="text-mint">shipped</span>.
        </>
      }
    >
      {/* StoryStream: dashed ultraviolet spine, mono timestamps on the rail */}
      <ol className="relative space-y-4 border-l border-dashed border-uv-rule pl-6 md:ml-44 md:pl-8">
        {experience.map((job, i) => {
          const current = i === 0;
          return (
            <li key={job.company} className="relative">
              <span
                aria-hidden
                className={`absolute top-8 -left-[29px] h-2.5 w-2.5 rounded-full md:-left-[37px] ${current ? "bg-mint" : "bg-white"}`}
              />
              <p className="meta mb-2 text-muted md:absolute md:top-7 md:-left-52 md:mb-0 md:w-40 md:text-right">
                {job.period}
              </p>
              <Reveal delay={i * 0.05} className={`p-6 sm:p-8 ${current ? "tile border-mint!" : "tile"}`}>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="kicker text-mint">
                    {job.company} · {job.location}
                  </p>
                  {current && <span className="pill bg-mint text-black">Now</span>}
                </div>
                <h3 className="mt-3 text-2xl leading-none font-bold sm:text-[2.125rem]">{job.role}</h3>
                <ul className="mt-6 space-y-3">
                  {job.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-base leading-[1.6] font-medium text-soft">
                      <span aria-hidden className="mt-[11px] h-px w-3 shrink-0 bg-mint" />
                      {h}
                    </li>
                  ))}
                </ul>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {job.tech.map((t) => (
                    <li key={t} className="pill border border-frame text-muted">
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
