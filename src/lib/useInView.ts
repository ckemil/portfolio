"use client";

import { useEffect, useState, type RefObject } from "react";

// Tiny IntersectionObserver hook, so scroll triggers don't pull framer-motion into the first-load bundle
export function useInView(ref: RefObject<Element | null>, { once = false, rootMargin = "0px" } = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (once && entry.isIntersecting) io.disconnect();
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, rootMargin]);

  return inView;
}
