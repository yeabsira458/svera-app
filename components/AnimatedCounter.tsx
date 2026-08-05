"use client";
import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  duration?: number;        // ms, default 2000
  direction?: "up" | "down"; // default "up"
  prefix?: string;
  suffix?: string;
  className?: string;
  trigger?: boolean;        // Start when true
}

/**
 * Animated numeric counter — counts up or down to a target value.
 * Uses requestAnimationFrame for smooth 60fps animation.
 * Starts only when `trigger` becomes true (controlled by useInView).
 */
export default function AnimatedCounter({
  target,
  duration = 2000,
  direction = "up",
  prefix = "",
  suffix = "",
  className = "",
  trigger = true,
}: AnimatedCounterProps) {
  const [value, setValue] = useState(direction === "up" ? 0 : target);
  const startTs = useRef<number | null>(null);
  const raf = useRef<number | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!trigger) {
      // Reset value and state when out of view
      setValue(direction === "up" ? 0 : target);
      startTs.current = null;
      if (raf.current) cancelAnimationFrame(raf.current);
      return;
    }

    const from = direction === "up" ? 0 : target;
    const to = direction === "up" ? target : 0;

    const step = (timestamp: number) => {
      if (!startTs.current) startTs.current = timestamp;
      const elapsed = timestamp - startTs.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out quad
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * eased);
      setValue(current);

      if (progress < 1) {
        raf.current = requestAnimationFrame(step);
      }
    };

    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [trigger, target, duration, direction]);

  return (
    <span className={className}>
      {prefix}{value.toLocaleString()}{suffix}
    </span>
  );
}
