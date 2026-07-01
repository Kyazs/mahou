"use client";

import { motion, useReducedMotion } from "motion/react";

interface StampOverlayProps {
  kanji: string;
  visible: boolean;
}

export function StampOverlay({ kanji, visible }: StampOverlayProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div
        className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
        aria-hidden="true"
      >
        <div style={{ opacity: 0.15 }}>
            <svg viewBox="0 0 100 100" className="h-[min(60vh,60vw)] w-[min(60vh,60vw)]" aria-hidden="true">
            <g>
              <rect
                x="14" y="14" width="72" height="72" rx="6"
                fill="var(--color-accent-crimson)"
                fillOpacity={0.85}
                style={{ filter: "blur(1px)", boxShadow: "0 0 12px rgba(197, 69, 69, 0.5)" }}
              />
              <text
                x="50%"
                y="64%"
                textAnchor="middle"
                fontFamily="var(--font-jp), sans-serif"
                fontSize="46"
                fill="#fff8f0"
              >
                {kanji}
              </text>
            </g>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={
        visible
          ? { opacity: [0, 1, 1, 0.15] }
          : { opacity: 0 }
      }
      transition={{
        duration: visible ? 1.1 : 0.3,
        times: visible ? [0, 0.55, 0.75, 1] : undefined,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        initial={{ y: "-100vh", scale: 1.4, filter: "blur(12px)" }}
        animate={
          visible
            ? { y: 0, scale: 1, filter: "blur(0px)" }
            : { y: "-100vh", scale: 1.4, filter: "blur(12px)" }
        }
        transition={{
          duration: visible ? 0.6 : 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <svg viewBox="0 0 100 100" className="h-[60vh] w-[60vh]" aria-hidden="true">
          <g>
            <rect
              x="14" y="14" width="72" height="72" rx="6"
              fill="var(--color-accent-crimson)"
              fillOpacity={0.85}
              style={{ filter: "blur(1px)", boxShadow: "0 0 12px rgba(197, 69, 69, 0.5)" }}
            />
            <text
              x="50%"
              y="64%"
              textAnchor="middle"
              fontFamily="var(--font-jp), sans-serif"
              fontSize="46"
              fill="#fff8f0"
            >
              {kanji}
            </text>
          </g>
        </svg>
      </motion.div>
    </motion.div>
  );
}
