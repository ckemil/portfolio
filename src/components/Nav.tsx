"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { profile } from "@/data/resume";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#radar", label: "Radar" },
  { href: "#play", label: "Play" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  // Mark the section currently in view with the mint underline
  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-frame bg-canvas">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-12">
        <a href="#top" className="display text-[1.75rem] leading-none">
          {profile.firstName}
          <span className="text-mint">.</span>
        </a>

        <ul className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`kicker block py-2 ${
                  active === l.href ? "text-foreground shadow-[inset_0_-1px_0_0_var(--mint)]" : "text-muted"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href={profile.resume} target="_blank" rel="noopener" className="btn btn-primary">
              Resume
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-frame lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-frame px-6 pt-4 pb-8 lg:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="kicker flex min-h-11 items-center text-sm">
                {l.label}
              </a>
            </li>
          ))}
          <li className="pt-4">
            <a href={profile.resume} target="_blank" rel="noopener" className="btn btn-primary">
              Resume
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}
