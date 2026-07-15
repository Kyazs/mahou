"use client";

import { motion, useReducedMotion } from "motion/react";
import { ScrollReveal } from "@/components/effects/scroll-reveal";

export function Name() {
  const prefersReducedMotion = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section data-kanji="魔" className="panel-edge">
      <ScrollReveal className="section-shell">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <div className="relative flex min-h-[16rem] items-center justify-center lg:min-h-[24rem]">
            <motion.div
              className="absolute inset-[12%] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(212,59,42,0.2), transparent 68%)",
              }}
              aria-hidden="true"
              initial={prefersReducedMotion ? false : { scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease }}
            />
            <motion.span
              className="font-serif-jp relative select-none text-[clamp(8rem,24vw,15rem)] font-bold leading-none text-[var(--color-accent-seal)]"
              style={{ textShadow: "0 0 70px rgba(212,59,42,0.4)" }}
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, filter: "blur(10px)", scale: 1.06 }
              }
              whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.85, ease }}
              aria-hidden="true"
            >
              魔
            </motion.span>
          </div>

          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="seal-dot" />
              <span className="font-jp text-sm tracking-[0.2em] text-[var(--color-accent-brass)]">
                名 · the name
              </span>
            </div>
            <h2 className="display-title mb-6">
              Magic is the discipline of order.
            </h2>
            <p className="lead mb-8">
              mahou (魔法) is Japanese for magic. Here, magic is not spectacle —
              it is the craft of doing the right work in the right order: root
              cause before fix, design before code, verify before ship.
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-[var(--color-line)] pt-6 font-mono text-xs text-[var(--color-text-faint)]">
              <span>
                <span className="text-[var(--color-accent-seal)]">魔</span> ma —
                power
              </span>
              <span>
                <span className="text-[var(--color-accent-brass)]">法</span> hō —
                method / law
              </span>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
