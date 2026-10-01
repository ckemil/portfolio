"use client";

import { useRef, type ReactNode } from "react";
import { useInView } from "@/lib/useInView";

export default function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, rootMargin: "0px 0px -80px 0px" });
  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={`reveal ${inView ? "is-in" : ""} ${className ?? ""}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </Tag>
  );
}
