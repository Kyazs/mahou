"use client";

import { motion, useReducedMotion } from "motion/react";
import { ScrollReveal } from "@/components/effects/scroll-reveal";

const steps = [
  {
    command: "/mahou-brainstorm",
    label: "Brainstorm",
    description: "Design to spec before code.",
  },
  {
    command: "/mahou-orchestrator",
    label: "Orchestrate",
    description: "Execute the plan task-by-task.",
  },
  {
    command: "/mahou-verify",
    label: "Verify",
    description: "Check implementation against spec.",
  },
  {
    command: "/mahou-ship",
    label: "Ship",
    description: "Push, create PR, ship it.",
  },
];

export function Workflow() {
  const prefersReducedMotion = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section data-kanji="輪" className="panel-edge">
      <ScrollReveal className="section-shell">
        <div className="mb-14 max-w-2xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="seal-dot" />
            <span className="font-jp text-sm tracking-[0.2em] text-[var(--color-accent-brass)]">
              輪 · cycle
            </span>
          </div>
          <h2 className="display-title mb-5">The closed loop</h2>
          <p className="lead">
            Brainstorm → orchestrate → verify → ship. Failures route to debug or
            replan — never silent drift.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-16">
          <ol className="relative space-y-0">
            <div
              className="absolute bottom-6 left-[0.7rem] top-6 w-px bg-gradient-to-b from-[var(--color-accent-brass)] via-[var(--color-accent-seal)] to-transparent"
              aria-hidden="true"
            />
            {steps.map((step, index) => (
              <motion.li
                key={step.command}
                className="relative grid gap-2 py-5 pl-10 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:items-baseline sm:gap-6"
                initial={prefersReducedMotion ? false : { opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.5, ease, delay: index * 0.06 }}
              >
                <span
                  className="absolute left-0 top-7 h-3.5 w-3.5 rounded-full border-2 border-[var(--color-accent-brass)] bg-[var(--color-bg)]"
                  aria-hidden="true"
                />
                <span className="font-medium text-[var(--color-text-primary)]">
                  {step.label}
                </span>
                <div>
                  <code className="mb-1 block font-mono text-[0.9rem] text-[var(--color-accent-brass)]">
                    {step.command}
                  </code>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {step.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>

          <motion.div
            className="ofuda p-7 sm:p-8"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease, delay: 0.15 }}
          >
            <p className="mb-6 font-jp text-sm tracking-[0.18em] text-[var(--color-accent-seal)]">
              分岐 · branches
            </p>
            <ul className="space-y-5">
              <li className="border-b border-[var(--color-line)] pb-5">
                <p className="mb-1 font-medium text-[var(--color-accent-brass)]">
                  Pass → Ship
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Verification clears. Push and open the PR.
                </p>
              </li>
              <li className="border-b border-[var(--color-line)] pb-5">
                <p className="mb-1 font-medium text-[var(--color-accent-seal)]">
                  Fail → Debug
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Root-cause first. Fix only what the evidence demands.
                </p>
              </li>
              <li>
                <p className="mb-1 font-medium text-[var(--color-text-primary)]">
                  Drift → Replan
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Scope or assumptions broke. Return to brainstorm.
                </p>
              </li>
            </ul>
          </motion.div>
        </div>
      </ScrollReveal>
    </section>
  );
}
