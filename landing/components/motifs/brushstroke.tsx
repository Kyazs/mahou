"use client";

import { motion, useReducedMotion } from "motion/react";

export function Brushstroke() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 120 12"
      className="mb-4 block h-3 w-[120px]"
      aria-hidden="true"
    >
      <motion.path
        d="M4 6 C20 1, 40 11, 60 6 S100 1, 116 6"
        stroke="var(--color-accent-warm)"
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
        initial={prefersReducedMotion ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
    </svg>
  );
}
