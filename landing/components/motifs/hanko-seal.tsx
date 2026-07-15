"use client";

import { motion, useReducedMotion } from "motion/react";

interface HankoSealProps {
  kanji: string;
  size?: "sm" | "lg";
  renderOn?: boolean;
}

const SIZE_PX = { sm: 40, lg: 120 };

export function HankoSeal({
  kanji,
  size = "sm",
  renderOn = true,
}: HankoSealProps) {
  const prefersReducedMotion = useReducedMotion();
  const dim = SIZE_PX[size];

  if (!renderOn) return null;

  return (
    <motion.div
      className="mb-4"
      style={{ width: dim, height: dim }}
      initial={
        prefersReducedMotion
          ? false
          : { scale: 1.35, opacity: 0, filter: "blur(6px)" }
      }
      whileInView={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden="true">
        <rect
          x="5"
          y="5"
          width="30"
          height="30"
          rx="3"
          fill="var(--color-accent-seal)"
          fillOpacity={0.9}
        />
        <text
          x="50%"
          y="60%"
          textAnchor="middle"
          fontFamily="var(--font-jp), sans-serif"
          fontSize="16"
          fill="#fff6ee"
        >
          {kanji}
        </text>
      </svg>
    </motion.div>
  );
}
