"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Download, MapPin } from "lucide-react";
import { profile } from "@/data/resume";

export default function Hero() {
  const reduce = useReducedMotion();
  const words = profile.name.split(" ");

  return (
    <section id="top" className="relative flex min-h-svh items-center overflow-hidden pt-16">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="blob top-[-10%] left-[-10%] h-[45vw] w-[45vw] bg-violet" />
        <div className="blob top-[20%] right-[-15%] h-[40vw] w-[40vw] bg-cyan [animation-delay:-6s]" />
        <div className="blob bottom-[-20%] left-[25%] h-[35vw] w-[35vw] bg-pink [animation-delay:-12s]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.04)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] bg-[size:64px_64px]" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-muted"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
          </span>
          <MapPin className="h-3.5 w-3.5" /> {profile.location}
        </motion.p>

        <h1 className="font-display text-[clamp(3rem,11vw,8.5rem)] leading-[0.9] font-bold tracking-tighter">
          {words.map((w, i) => (
            <motion.span
              key={w}
              initial={reduce ? false : { opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={`mr-[0.2em] inline-block ${i === words.length - 1 ? "text-gradient" : ""}`}
            >
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="mt-8 font-display text-2xl font-semibold sm:text-3xl">
            {profile.title} <span className="text-muted">·</span>{" "}
            <span className="text-muted">{profile.tagline}</span>
          </p>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{profile.intro}</p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="group rounded-full bg-gradient-to-r from-violet via-cyan to-pink p-[2px] transition-transform hover:scale-105"
            >
              <span className="block rounded-full bg-background px-7 py-3.5 font-semibold transition-colors group-hover:bg-transparent group-hover:text-background">
                Get in touch
              </span>
            </a>
            <a
              href={profile.resume}
              download
              className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold transition-transform hover:scale-105"
            >
              <Download className="h-4 w-4" /> Download resume
            </a>
          </div>
        </motion.div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted motion-reduce:animate-none"
      >
        <ArrowDown />
      </a>
    </section>
  );
}
