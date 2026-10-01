"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

// Ships framer-motion's small core up front; the animation features download after first render
const loadFeatures = () => import("@/lib/motionFeatures").then((mod) => mod.default);

export default function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={loadFeatures} strict>{children}</LazyMotion>;
}
