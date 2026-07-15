"use client";

import { motion, useReducedMotion } from "motion/react";
import { ParticleField } from "@/components/motifs/particle-field";
import { SeigaihaWaves } from "@/components/motifs/seigaiha-waves";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      id="top"
      data-kanji="魔法"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pb-24 pt-28 sm:px-8"
    >
      <ParticleField variant="embers" scopeToSection />

      <div
        className="seal-orb pointer-events-none absolute right-[-10%] top-[18%] h-[min(55vw,22rem)] w-[min(55vw,22rem)] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle at center, rgba(212,59,42,0.22) 0%, rgba(212,59,42,0.06) 42%, transparent 70%)",
          animation: prefersReducedMotion
            ? undefined
            : "seal-breathe 9s ease-in-out infinite",
        }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-[min(42vw,28rem)] opacity-[0.07]"
        aria-hidden="true"
      >
        <div className="absolute inset-y-0 left-[12%] w-px bg-[var(--color-accent-brass)]" />
        <div className="absolute inset-y-0 left-[18%] w-px bg-[var(--color-accent-seal)] opacity-60" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] lg:gap-6">
        <motion.div
          className="relative hidden min-h-[22rem] items-center justify-center lg:flex"
          initial={prefersReducedMotion ? false : { opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease }}
          aria-hidden="true"
        >
          <div className="ofuda relative flex h-[min(70vh,32rem)] w-[9.5rem] flex-col items-center justify-between px-3 py-8">
            <span className="font-jp text-[0.65rem] tracking-[0.35em] text-[var(--color-accent-brass)]">
              儀式
            </span>
            <span
              className="font-serif-jp writing-vertical select-none text-[clamp(3.5rem,8vw,5.5rem)] font-bold leading-none text-[var(--color-accent-seal)]"
              style={{
                writingMode: "vertical-rl",
                textShadow: "0 0 48px rgba(212,59,42,0.35)",
              }}
            >
              魔法
            </span>
            <span className="h-10 w-10 rounded-[3px] border border-[var(--color-accent-seal)] font-jp text-lg leading-10 text-[var(--color-accent-seal)]">
              魔
            </span>
          </div>
        </motion.div>

        <div className="relative max-w-2xl lg:pl-4">
          <motion.div
            className="mb-6 flex items-center gap-3"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease }}
          >
            <span className="seal-dot" />
            <span className="font-jp text-sm tracking-[0.28em] text-[var(--color-accent-brass)]">
              魔法 · mahou
            </span>
          </motion.div>

          <motion.h1
            className="text-[clamp(3.5rem,12vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.04em] [text-wrap:balance]"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
          >
            Discipline
            <br />
            <span className="text-[var(--color-accent-brass)]">becomes</span>
            <br />
            magic.
          </motion.h1>

          <motion.p
            className="mt-7 max-w-[40ch] text-[clamp(1.05rem,2.1vw,1.2rem)] text-[var(--color-text-secondary)] [text-wrap:pretty]"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            Portable opencode slash commands that enforce root cause before fix,
            design before code, verify before ship.
          </motion.p>

          <motion.div
            className="mt-11 flex flex-wrap gap-3 sm:gap-4"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.75, ease }}
          >
            <a href="#install" className="btn-primary">
              Install mahou
            </a>
            <a
              href="https://github.com/Kyazs/mahou"
              className="btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </motion.div>

          <motion.p
            className="mt-10 font-mono text-xs tracking-wide text-[var(--color-text-faint)]"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.95 }}
          >
            zero npm · zero MCP · pure markdown ritual
          </motion.p>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 z-20 w-full">
        <SeigaihaWaves position="bottom" />
      </div>
    </section>
  );
}
