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
    <section id="contact" className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
      <Reveal className="rounded-[40px] bg-uv p-8 text-white sm:p-14 md:p-20">
        <p className="kicker mb-4 text-mint">Contact</p>
        <h2 className="display text-[clamp(3rem,9vw,6.69rem)]">
          Let&apos;s build something <span className="text-mint">solid</span>.
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-[1.6] font-medium text-white/85">
          Have a backend or microservices challenge in mind? Drop me a line.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a href={`mailto:${profile.email}`} className="btn btn-primary justify-between gap-6 font-sans text-sm tracking-normal normal-case">
            <span className="inline-flex items-center gap-3 break-all">
              <Mail className="h-4 w-4 shrink-0" /> {profile.email}
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-light justify-between gap-6 text-white"
          >
            <span className="inline-flex items-center gap-3">
              <LinkedInIcon className="h-4 w-4" /> LinkedIn
            </span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
