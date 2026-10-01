"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Download, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { profile } from "@/data/resume";

// three.js is heavy, so load the scene in the browser after the page renders
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero() {
  const reduce = useReducedMotion();
  const words = profile.name.split(" ");

  return (
    <section id="top" className="relative flex min-h-svh items-center overflow-hidden pt-16">
      <HeroScene className="absolute inset-y-0 right-0 w-full opacity-30 lg:w-[58%] lg:opacity-100" />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-16 md:px-12">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pill mb-8 gap-1.5 bg-mint text-black"
        >
          <MapPin className="h-3 w-3" /> {profile.location}
        </motion.p>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="whisper mb-5 text-soft"
        >
          {profile.title}
        </motion.p>

        <h1 className="display text-[clamp(3.5rem,13vw,10rem)]">
          {words.map((w, i) => (
            <motion.span
              key={w}
              initial={reduce ? false : { opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`block ${i === words.length - 1 ? "text-mint" : ""}`}
            >
              {w}
              {/* keeps "Emil Mohammed" as two words in the page text */}
              {i < words.length - 1 && " "}
            </motion.span>
          ))}
          <span className="sr-only">, {profile.title}</span>
        </h1>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          <p className="kicker mt-8 text-muted">{profile.tagline}</p>
          <p className="mt-4 max-w-xl text-base leading-[1.6] font-medium text-soft sm:text-lg">{profile.intro}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#contact" className="btn btn-primary">
              Get in touch
            </a>
            <a href={profile.resume} download className="btn btn-secondary">
              <Download className="h-4 w-4" /> Download resume
            </a>
          </div>
        </motion.div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-6 left-1/2 flex h-11 w-11 -translate-x-1/2 animate-bounce items-center justify-center rounded-full border border-frame text-muted motion-reduce:animate-none"
      >
        <ArrowDown className="h-4 w-4" />
      </a>
    </section>
  );
}
