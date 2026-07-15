"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { SeigaihaWaves } from "@/components/motifs/seigaiha-waves";
import { StampOverlay } from "@/components/effects/stamp-overlay";

export function Footer() {
  const prefersReducedMotion = useReducedMotion();
  const [stampVisible, setStampVisible] = useState(false);
  const [linksVisible, setLinksVisible] = useState(Boolean(prefersReducedMotion));
  const effectiveLinksVisible = linksVisible || Boolean(prefersReducedMotion);

  return (
    <footer data-kanji="完" className="panel-edge relative z-50">
      <StampOverlay kanji="完" visible={stampVisible} />
      <ScrollReveal className="relative">
        <div className="relative">
          <SeigaihaWaves position="top" className="!top-0 !bottom-auto !h-[30px]" />
        </div>

        <div className="mx-auto max-w-7xl px-[clamp(1.25rem,4vw,2.75rem)] pb-12 pt-28">
          <div className="mb-16 text-center">
            <p className="mb-4 font-jp text-sm tracking-[0.3em] text-[var(--color-accent-seal)]">
              完
            </p>
            <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
              The work is the magic.
            </p>
          </div>

          <div className="ritual-line mb-10" />

          <motion.div
            className="flex flex-wrap items-center justify-between gap-6 text-sm text-[var(--color-text-secondary)] max-md:flex-col max-md:text-center"
            style={{ pointerEvents: effectiveLinksVisible ? "auto" : "none" }}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            onViewportEnter={() => {
              if (!prefersReducedMotion) {
                setStampVisible(true);
                setTimeout(() => setLinksVisible(true), 900);
              }
            }}
          >
            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="https://github.com/Kyazs/mahou"
                className="transition-colors hover:text-[var(--color-accent-brass)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent-brass)] focus-visible:outline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://github.com/Kyazs/mahou/blob/main/README.md"
                className="transition-colors hover:text-[var(--color-accent-brass)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent-brass)] focus-visible:outline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Docs
              </a>
              <a
                href="#install"
                className="transition-colors hover:text-[var(--color-accent-brass)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent-brass)] focus-visible:outline-offset-2"
              >
                Install
              </a>
            </div>
            <span className="text-[var(--color-text-faint)]">Share freely.</span>
          </motion.div>
        </div>
      </ScrollReveal>
    </footer>
  );
}
