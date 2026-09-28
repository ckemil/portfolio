import { ArrowUpRight, Mail } from "lucide-react";
import { profile } from "@/data/resume";
import Reveal from "./Reveal";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="relative mx-auto max-w-6xl overflow-hidden px-4 py-24 sm:px-6 md:py-32">
      <Reveal className="relative overflow-hidden rounded-[2.5rem] border border-white/10 p-8 sm:p-14 md:p-20">
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-violet/30 via-background to-cyan/20" />
        <div aria-hidden className="blob -z-10 -right-20 -bottom-20 h-80 w-80 bg-pink" />

        <p className="mb-4 font-display text-sm font-medium tracking-[0.3em] text-cyan uppercase">Contact</p>
        <h2 className="font-display text-[clamp(2.5rem,8vw,6rem)] leading-[0.95] font-bold tracking-tight">
          Let&apos;s build something <span className="text-gradient">solid</span>.
        </h2>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Have a backend or microservices challenge in mind? Drop me a line.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex items-center justify-between gap-6 rounded-full bg-foreground px-7 py-4 font-semibold text-background transition-transform hover:scale-105"
          >
            <span className="inline-flex items-center gap-3 break-all">
              <Mail className="h-5 w-5 shrink-0" /> {profile.email}
            </span>
            <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="glass group inline-flex items-center justify-between gap-6 rounded-full px-7 py-4 font-semibold transition-transform hover:scale-105"
          >
            <span className="inline-flex items-center gap-3">
              <LinkedInIcon className="h-5 w-5" /> LinkedIn
            </span>
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
