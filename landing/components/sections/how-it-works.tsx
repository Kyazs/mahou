"use client";

import { motion, useReducedMotion } from "motion/react";
import { ScrollReveal } from "@/components/effects/scroll-reveal";

const layers = [
  {
    kanji: "基",
    title: "Project",
    description:
      "Initialize projects, research approaches, and map existing codebases.",
    detail: "context · research · map",
  },
  {
    kanji: "技",
    title: "Feature",
    description:
      "Brainstorm specs, orchestrate implementation, and review against the plan.",
    detail: "spec · execute · review",
  },
  {
    kanji: "運",
    title: "Lifecycle",
    description: "Resume sessions, verify the build, and ship pull requests.",
    detail: "resume · verify · ship",
  },
];

export function HowItWorks() {
  const prefersReducedMotion = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section data-kanji="流" className="panel-edge">
      <ScrollReveal className="section-shell">
        <div className="mb-14 max-w-2xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="seal-dot" />
            <span className="font-jp text-sm tracking-[0.2em] text-[var(--color-accent-brass)]">
              流 · flow
            </span>
          </div>
          <h2 className="display-title mb-5">Three layers. One current.</h2>
          <p className="lead">
            From project context through feature execution to delivery — each
            layer feeds the next.
          </p>
        </div>

        <div className="relative">
          <div
            className="pointer-events-none absolute left-[8%] right-[8%] top-[4.5rem] hidden h-px bg-gradient-to-r from-transparent via-[var(--color-accent-brass)] to-transparent opacity-40 md:block"
            aria-hidden="true"
          />

          <ol className="grid gap-5 md:grid-cols-3 md:gap-6">
            {layers.map((layer, index) => (
              <motion.li
                key={layer.title}
                className="ofuda group relative px-6 pb-7 pt-10"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, ease, delay: index * 0.1 }}
              >
                <div className="mb-6 flex items-start justify-between gap-3">
                  <span
                    className="font-serif-jp text-4xl text-[var(--color-accent-seal)]"
                    aria-hidden="true"
                  >
                    {layer.kanji}
                  </span>
                  <span className="font-mono text-[0.65rem] tracking-[0.16em] text-[var(--color-text-faint)]">
                    layer {index + 1}
                  </span>
                </div>
                <h3 className="mb-3 text-2xl font-semibold tracking-tight">
                  {layer.title}
                </h3>
                <p className="mb-5 text-[var(--color-text-secondary)] [text-wrap:pretty]">
                  {layer.description}
                </p>
                <p className="font-mono text-xs text-[var(--color-accent-brass)]">
                  {layer.detail}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </ScrollReveal>
    </section>
  );
}
