"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Returns true when the referenced element is in the viewport.
 * Updates dynamically to allow repeating animations.
 */
export function useInView(threshold = 0.2) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
