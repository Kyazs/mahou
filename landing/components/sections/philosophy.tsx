"use client";

import { motion, useReducedMotion } from "motion/react";
import { ScrollReveal } from "@/components/effects/scroll-reveal";

const principles = [
  {
    kanji: "道",
    title: "Root cause before fix",
    description:
      "Investigate before acting. One hypothesis, one test — verify before continuing. No stacked patches.",
  },
  {
    kanji: "式",
    title: "Design before code",
    description:
      "Spec and plan before implementation. Know what you are building before you build it.",
  },
  {
    kanji: "証",
    title: "Verify before ship",
    description:
      "Check the build against the spec. Nothing ships without passing verification.",
  },
];

export function Philosophy() {
  const prefersReducedMotion = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section id="doctrine" data-kanji="道" className="panel-edge">
      <ScrollReveal className="section-shell">
        <div className="mb-16 max-w-2xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="seal-dot" />
            <span className="font-jp text-sm tracking-[0.2em] text-[var(--color-accent-brass)]">
              道 · doctrine
            </span>
          </div>
          <h2 className="display-title mb-5">Three iron laws</h2>
          <p className="lead">
            Not guidelines — the ritual that turns chaos into power you can
            trust.
          </p>
        </div>

        <ol className="relative space-y-0">
          <div
            className="absolute bottom-8 left-6 top-8 w-px bg-gradient-to-b from-[var(--color-accent-seal)] via-[var(--color-accent-brass)] to-transparent max-md:left-5"
            aria-hidden="true"
          />

          {principles.map((principle, index) => (
            <motion.li
              key={principle.title}
              className="relative grid gap-5 border-b border-[var(--color-line)] py-10 pl-14 last:border-b-0 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.5fr)] md:items-center md:gap-10 md:pl-16"
              initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, ease, delay: index * 0.07 }}
            >
              <span
                className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[var(--color-accent-seal)] shadow-[0_0_16px_rgba(212,59,42,0.5)] md:left-4"
                aria-hidden="true"
              />

              <span
                className="font-serif-jp text-5xl leading-none text-[var(--color-accent-seal)] md:text-6xl"
                aria-hidden="true"
              >
                {principle.kanji}
              </span>

              <h3 className="text-2xl font-semibold tracking-tight md:text-[1.65rem]">
                {principle.title}
              </h3>

              <p className="text-[var(--color-text-secondary)] [text-wrap:pretty]">
                {principle.description}
              </p>
            </motion.li>
          ))}
        </ol>
      </ScrollReveal>
    </section>
  );
}
