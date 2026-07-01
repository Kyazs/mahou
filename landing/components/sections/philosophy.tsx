"use client";

import { motion, useReducedMotion } from "motion/react";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { Brushstroke } from "@/components/motifs/brushstroke";
import { HankoSeal } from "@/components/motifs/hanko-seal";
import { MagicCard } from "@/components/effects/magic-card";

const principles = [
  {
    kanji: "道",
    title: "Root cause before fix",
    description:
      "Investigate before acting. One hypothesis, one test, verify before continuing.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
        <circle cx="24" cy="6" r="3" fill="var(--color-accent-violet)" />
        <path
          d="M24 9 L24 28 M24 28 L16 40 M24 28 L32 40 M24 28 L24 42"
          stroke="var(--color-accent-violet)"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    kanji: "道",
    title: "Design before code",
    description:
      "Spec and plan before implementation. Know what you're building before you build it.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
        <path
          d="M10 10 L34 10 L38 14 L38 38 L10 38 Z M14 16 L32 16 M14 22 L32 22 M14 28 L26 28"
          stroke="var(--color-accent-violet)"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    kanji: "道",
    title: "Verify before ship",
    description:
      "Check the build against the spec. Nothing ships without passing verification.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
        <rect
          x="14"
          y="14"
          width="20"
          height="20"
          fill="none"
          stroke="var(--color-accent-violet)"
          strokeWidth={2.5}
          rx="2"
        />
        <path
          d="M19 19 L29 19 M19 24 L29 24 M19 29 L25 29"
          stroke="var(--color-accent-violet)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function Philosophy() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section data-kanji="道" className="panel-warm">
      <ScrollReveal className="relative mx-auto max-w-[72ch] px-8 py-32">
        <Brushstroke />
        <HankoSeal kanji="道" renderOn={false} />
        <h2 className="mb-8 font-serif-jp text-5xl font-bold [text-wrap:balance]">
          Discipline is magic
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.15 }}
            >
              <MagicCard className="p-8">
                <div className="mb-4">{principle.icon}</div>
                <h3 className="mb-2 font-serif-jp text-2xl font-medium">
                  {principle.title}
                </h3>
                <p className="text-[var(--color-text-secondary)]">
                  {principle.description}
                </p>
              </MagicCard>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
