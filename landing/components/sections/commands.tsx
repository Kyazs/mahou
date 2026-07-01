"use client";

import { motion, useReducedMotion } from "motion/react";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { Brushstroke } from "@/components/motifs/brushstroke";
import { HankoSeal } from "@/components/motifs/hanko-seal";
import { MagicCard } from "@/components/effects/magic-card";

const commands = [
  { name: "/mahou-brainstorm", description: "Design to spec before writing code." },
  { name: "/mahou-orchestrator", description: "Execute a plan task-by-task via subagents." },
  { name: "/mahou-verify", description: "Check implementation against the spec." },
  { name: "/mahou-ship", description: "Push, create a PR, and filter planning artifacts." },
  { name: "/mahou-debug", description: "Root-cause investigation before any fix." },
];

export function Commands() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section data-kanji="術" className="panel-cold panel-border-top">
      <ScrollReveal className="relative mx-auto max-w-[72ch] px-8 py-32">
        <Brushstroke />
        <HankoSeal kanji="術" renderOn={false} />
        <h2 className="mb-8 font-serif-jp text-5xl font-bold [text-wrap:balance]">
          Commands
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-8 max-md:grid-cols-1">
          {commands.map((cmd, index) => (
            <motion.div
              key={cmd.name}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
            >
              <MagicCard className="p-8">
                <svg
                  viewBox="0 0 100 4"
                  preserveAspectRatio="none"
                  className="mb-4 block h-1 w-full"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M2 2 Q25 1 50 2 T98 2"
                    stroke="var(--color-accent-warm)"
                    strokeWidth={3}
                    fill="none"
                    strokeLinecap="round"
                    initial={prefersReducedMotion ? false : { pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </svg>
                <code className="mb-2 block font-mono text-[0.95rem] text-[var(--color-accent-warm)]">
                  {cmd.name}
                </code>
                <p className="text-[var(--color-text-secondary)]">
                  {cmd.description}
                </p>
              </MagicCard>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
