"use client";

import { motion, useReducedMotion } from "motion/react";
import { ScrollReveal } from "@/components/effects/scroll-reveal";

const commands = [
  {
    name: "/mahou-brainstorm",
    description: "Design to spec before writing code.",
    layer: "Feature",
  },
  {
    name: "/mahou-orchestrator",
    description: "Execute a plan task-by-task via subagents.",
    layer: "Feature",
  },
  {
    name: "/mahou-verify",
    description: "Check implementation against the spec.",
    layer: "Lifecycle",
  },
  {
    name: "/mahou-ship",
    description: "Push, create a PR, filter planning artifacts.",
    layer: "Lifecycle",
  },
  {
    name: "/mahou-debug",
    description: "Root-cause investigation before any fix.",
    layer: "Any",
  },
  {
    name: "/mahou-review",
    description: "Discover, triage, and verify real issues only.",
    layer: "Any",
  },
];

export function Commands() {
  const prefersReducedMotion = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section id="commands" data-kanji="術" className="panel-edge">
      <ScrollReveal className="section-shell">
        <div className="mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="seal-dot" />
              <span className="font-jp text-sm tracking-[0.2em] text-[var(--color-accent-brass)]">
                術 · spellbook
              </span>
            </div>
            <h2 className="display-title">Commands that enforce order</h2>
          </div>
          <p className="lead md:max-w-[26ch] md:text-right">
            Invoked only when needed. Zero structural token cost until you call
            them.
          </p>
        </div>

        <div className="overflow-hidden border border-[var(--color-line)] bg-[var(--color-surface)]">
          <div className="hidden grid-cols-[minmax(0,1.15fr)_minmax(0,1.45fr)_auto] gap-6 border-b border-[var(--color-line)] px-6 py-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--color-text-faint)] sm:grid sm:px-8">
            <span>Command</span>
            <span>Purpose</span>
            <span>Layer</span>
          </div>
          <ul>
            {commands.map((cmd, index) => (
              <motion.li
                key={cmd.name}
                className="group grid gap-2 border-b border-[var(--color-line)] px-5 py-5 last:border-b-0 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1.45fr)_auto] sm:items-center sm:gap-6 sm:px-8 sm:py-5"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, ease, delay: index * 0.04 }}
              >
                <code className="font-mono text-[0.95rem] font-medium text-[var(--color-accent-brass)] transition-colors group-hover:text-[var(--color-text-primary)]">
                  {cmd.name}
                </code>
                <p className="text-sm text-[var(--color-text-secondary)] sm:text-base">
                  {cmd.description}
                </p>
                <span className="inline-flex w-fit items-center gap-2 font-mono text-[0.7rem] tracking-[0.12em] text-[var(--color-text-faint)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-seal)] opacity-80" />
                  {cmd.layer}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </ScrollReveal>
    </section>
  );
}
