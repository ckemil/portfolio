"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { profile } from "@/data/resume";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || open ? "border-b border-white/10 bg-background/70 backdrop-blur-xl" : ""
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="font-display text-xl font-bold tracking-tight">
          {profile.firstName}
          <span className="text-gradient">.</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm text-muted transition-colors hover:text-foreground">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener"
              className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-transform hover:scale-105"
            >
              Resume
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 px-4 pb-6 md:hidden">
          {[...links, { href: profile.resume, label: "Resume" }].map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-display text-2xl font-semibold"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
