import { education } from "@/data/resume";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Education() {
  return (
    <Section
      id="education"
      eyebrow="Education"
      title={
        <>
          Where it <span className="text-mint">started</span>.
        </>
      }
    >
      {/* White block = editorial spotlight */}
      <Reveal className="flex flex-col gap-6 rounded-[24px] bg-white p-8 text-black sm:flex-row sm:items-end sm:justify-between sm:p-10">
        <div>
          <p className="kicker text-black/60">
            {education.school} · {education.location}
          </p>
          <h3 className="mt-3 text-2xl leading-none font-bold sm:text-[2.125rem]">{education.degree}</h3>
        </div>
        <span className="display text-[3.75rem] leading-none">{education.period.replace(/\s/g, "")}</span>
      </Reveal>
    </Section>
  );
}
