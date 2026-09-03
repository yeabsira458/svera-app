"use client";
import { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: "up" | "left" | "right" | "scale";
  delay?: number; // ms
  threshold?: number;
}

/**
 * Wraps children in a div that animates into view each time the user
 * scrolls to it (repeats — does NOT disconnect after first trigger).
 * Also exports `inView` state so parent can pass it to AnimatedCounter.
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

    let timer: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timer);
        if (entry.isIntersecting) {
          // Entering viewport → show
          timer = setTimeout(() => el.classList.add("visible"), delay);
        } else {
          // Leaving viewport → hide so it re-animates next time
          el.classList.remove("visible");
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [delay, threshold]);

  return (
    <div ref={ref} className={`${revealClass} ${className}`}>
      {children}
    </div>
  );
}

/**
 * A variant that also tracks inView state for AnimatedCounter.
 * Usage: <ScrollRevealWithInView>{(inView) => <AnimatedCounter trigger={inView} ... />}</ScrollRevealWithInView>
 */
export function ScrollRevealWithInView({
  children,
  className = "",
  variant = "up",
  delay = 0,
  threshold = 0.15,
}: Omit<ScrollRevealProps, "children"> & {
  children: (inView: boolean) => React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

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

    let timer: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timer);
        if (entry.isIntersecting) {
          timer = setTimeout(() => {
            el.classList.add("visible");
            setInView(true);
          }, delay);
        } else {
          el.classList.remove("visible");
          setInView(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [delay, threshold]);

  return (
    <div ref={ref} className={`${revealClass} ${className}`}>
      {children(inView)}
    </div>
  );
}
