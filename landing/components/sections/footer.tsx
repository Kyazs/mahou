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
    <section
      data-kanji="完"
      className="panel-warm panel-border-top relative z-50"
    >
      <StampOverlay kanji="完" visible={stampVisible} />
        <ScrollReveal className="relative">
          <div className="relative">
            <SeigaihaWaves position="top" className="!top-0 !bottom-auto !h-[30px]" />
          </div>
          <motion.div
            className="mx-auto flex max-w-[72ch] flex-wrap justify-center gap-8 px-8 pb-16 pt-32 text-sm text-[var(--color-text-secondary)] max-md:flex-col max-md:items-center max-md:gap-4"
            style={{ pointerEvents: effectiveLinksVisible ? "auto" : "none" }}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            onViewportEnter={() => {
              if (!prefersReducedMotion) {
                setStampVisible(true);
                setTimeout(() => setLinksVisible(true), 1100);
              }
            }}
          >
            <a
              href="https://github.com/Kyazs/magic-pi-opencode"
              className="transition-colors hover:text-[var(--color-accent-warm)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent-warm)] focus-visible:outline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://github.com/Kyazs/magic-pi-opencode/blob/main/README.md"
              className="transition-colors hover:text-[var(--color-accent-warm)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent-warm)] focus-visible:outline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs
            </a>
            <span>Share freely.</span>
          </motion.div>
      </ScrollReveal>
    </section>
  );
}
