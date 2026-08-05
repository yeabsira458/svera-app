"use client";
import { useEffect, useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: "up" | "left" | "right" | "scale";
  delay?: number; // ms
  threshold?: number;
}

/**
 * Wraps children in a div that animates into view when scrolled to.
 * Uses IntersectionObserver + CSS transitions defined in globals.css.
 */
export default function ScrollReveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  const revealClass =
    variant === "left"
      ? "reveal-left"
      : variant === "right"
      ? "reveal-right"
      : variant === "scale"
      ? "reveal-scale"
      : "reveal";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  return (
    <div ref={ref} className={`${revealClass} ${className}`}>
      {children}
    </div>
  );
}
