import { GraduationCap } from "lucide-react";
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
          Where it <span className="text-gradient">started</span>.
        </>
      }
    >
      <Reveal className="glass glow flex flex-col gap-6 rounded-3xl p-8 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet to-cyan">
          <GraduationCap className="h-8 w-8 text-background" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-2xl font-bold sm:text-3xl">{education.degree}</h3>
          <p className="mt-1 text-muted">
            {education.school} · {education.location}
          </p>
        </div>
        <span className="font-display text-cyan">{education.period}</span>
      </Reveal>
    </Section>
  );
}
