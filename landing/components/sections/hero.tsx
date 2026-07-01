"use client";

import { motion, useReducedMotion } from "motion/react";
import { ParticleField } from "@/components/motifs/particle-field";
import { SeigaihaWaves } from "@/components/motifs/seigaiha-waves";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      data-kanji="魔法"
      className="panel-warm relative flex min-h-screen flex-col items-center justify-center px-8 py-16 text-center"
    >
      <ParticleField variant="embers" scopeToSection />

      {/* Wash ellipse — static */}
      <svg
        viewBox="0 0 700 500"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <ellipse
          cx="350" cy="230" rx="300" ry="200"
          fill="#6d4aff"
          opacity={0.08}
        />
      </svg>

      {/* Ink splash — sumi-e brushstroke on mount */}
      <motion.svg
        viewBox="0 0 700 500"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 0.06 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.path
          d="M100 400 C200 50, 350 450, 500 100 S600 350, 650 200"
          stroke="var(--color-accent-warm)"
          strokeWidth={40}
          fill="none"
          strokeLinecap="round"
          initial={prefersReducedMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </motion.svg>

      {/* Layered kanji — ink-wash depth effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
        initial={prefersReducedMotion ? false : { opacity: 0, filter: "blur(8px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      >
        <span
          className="font-jp select-none leading-none"
          style={{
            fontSize: "clamp(8rem, 25vw, 20rem)",
            color: "transparent",
            WebkitTextStroke: "2px var(--color-accent-warm)",
            opacity: 0.12,
            transform: "translate(-4px, -4px)",
          }}
        >
          魔法
        </span>
        <span
          className="font-jp absolute select-none leading-none"
          style={{
            fontSize: "clamp(8rem, 25vw, 20rem)",
            color: "transparent",
            WebkitTextStroke: "1px var(--color-accent-warm)",
            opacity: 0.25,
          }}
        >
          魔法
        </span>
      </motion.div>

      {/* Text overlay — mount-only animations */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
        <motion.p
          className="mb-2 font-jp text-sm tracking-[0.2em] text-[var(--color-text-secondary)]"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          魔法
        </motion.p>

        <motion.h1
          className="text-[clamp(3rem,10vw,6rem)] font-bold leading-none tracking-[-0.04em] [text-wrap:balance]"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          mahou
        </motion.h1>

        <motion.p
          className="mt-8 max-w-[40ch] text-[clamp(1.125rem,2.5vw,1.5rem)] text-[var(--color-text-secondary)] [text-wrap:balance]"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          Discipline, automated.
        </motion.p>

        <motion.div
          className="pointer-events-auto mt-16 flex flex-wrap justify-center gap-4"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <a
            href="https://github.com/Kyazs/magic-pi-opencode"
            className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent-warm)] px-6 py-3 font-medium text-[var(--color-bg)] transition-transform hover:-translate-y-px hover:shadow-[0_0_28px_rgba(255,184,108,0.35)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent-warm)] focus-visible:outline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
          <a
            href="https://github.com/Kyazs/magic-pi-opencode/blob/main/README.md"
            className="inline-flex items-center justify-center rounded-lg border border-[var(--color-accent-violet)] bg-[var(--color-surface)] px-6 py-3 font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[rgba(109,74,255,0.12)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent-warm)] focus-visible:outline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read docs
          </a>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 z-20 w-full">
        <SeigaihaWaves position="bottom" />
      </div>
    </section>
  );
}
