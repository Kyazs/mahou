"use client";

import { motion, useReducedMotion, useInView } from "motion/react";
import { useRef } from "react";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { Brushstroke } from "@/components/motifs/brushstroke";
import { HankoSeal } from "@/components/motifs/hanko-seal";

const nodes = [
  {
    title: "Project",
    description:
      "Initialize projects, research approaches, and map existing codebases.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
        <rect x="8" y="14" width="32" height="22" rx="3" fill="var(--color-accent-violet)" opacity="0.12" stroke="var(--color-accent-violet)" strokeWidth="1.5" />
        <path d="M27 14 L27 24 L37 24 Z" fill="var(--color-accent-violet)" opacity="0.25" />
        <rect x="14" y="20" width="18" height="2" rx="1" fill="var(--color-accent-violet)" opacity="0.6" />
        <rect x="14" y="26" width="14" height="2" rx="1" fill="var(--color-accent-violet)" opacity="0.4" />
        <rect x="14" y="32" width="10" height="2" rx="1" fill="var(--color-accent-violet)" opacity="0.4" />
      </svg>
    ),
  },
  {
    title: "Feature",
    description:
      "Brainstorm specs, orchestrate implementation, and review against the plan.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
        <circle cx="24" cy="24" r="14" fill="none" stroke="var(--color-accent-violet)" strokeWidth="1.5" opacity="0.25" />
        <circle cx="24" cy="24" r="9" fill="none" stroke="var(--color-accent-violet)" strokeWidth="1.5" opacity="0.45" />
        <circle cx="24" cy="24" r="4.5" fill="var(--color-accent-violet)" opacity="0.8" />
        <line x1="24" y1="6" x2="24" y2="12" stroke="var(--color-accent-violet)" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" />
        <line x1="24" y1="36" x2="24" y2="42" stroke="var(--color-accent-violet)" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" />
        <line x1="6" y1="24" x2="12" y2="24" stroke="var(--color-accent-violet)" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" />
        <line x1="36" y1="24" x2="42" y2="24" stroke="var(--color-accent-violet)" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Lifecycle",
    description:
      "Resume sessions, verify the build, and ship pull requests.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
        <circle cx="24" cy="24" r="14" fill="none" stroke="var(--color-accent-violet)" strokeWidth="1.5" opacity="0.2" />
        <path d="M36 24 A14 14 0 1 1 22 10" fill="none" stroke="var(--color-accent-warm)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <polygon points="24,6 30,12 18,12" fill="var(--color-accent-warm)" opacity="0.9" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  const prefersReducedMotion = useReducedMotion();

  const step1Ref = useRef<HTMLLIElement>(null);
  const step2Ref = useRef<HTMLLIElement>(null);
  const step3Ref = useRef<HTMLLIElement>(null);

  const viewportOpts = { rootMargin: "-20% 0px -20% 0px", amount: 0.3 as const, once: true };
  const step1Active = useInView(step1Ref, viewportOpts);
  const step2Active = useInView(step2Ref, viewportOpts);
  const step3Active = useInView(step3Ref, viewportOpts);

  if (prefersReducedMotion) {
    return (
      <section data-kanji="流" className="panel-warm">
        <ScrollReveal className="relative mx-auto max-w-[72ch] px-8 py-32">
          <Brushstroke />
          <HankoSeal kanji="流" renderOn={false} />
          <h2 className="mb-8 font-serif-jp text-5xl font-bold [text-wrap:balance]">How it works</h2>
          <div className="py-16">{renderDiagram(true)}</div>
        </ScrollReveal>
      </section>
    );
  }

  return (
    <section data-kanji="流" className="panel-warm">
      <ScrollReveal className="relative mx-auto max-w-[72ch] px-8 py-32">
        <Brushstroke />
        <HankoSeal kanji="流" renderOn={false} />
        <h2 className="mb-8 font-serif-jp text-5xl font-bold [text-wrap:balance]">
          How it works
        </h2>
        <div className="py-16">
          {renderDiagram(false, step1Active, step2Active, step3Active)}
        </div>
      </ScrollReveal>
    </section>
  );

  function renderDiagram(
    reduced: boolean,
    s1 = false,
    s2 = false,
    s3 = false
  ) {
    const seg1 = reduced || s1;
    const seg2 = reduced || s2;

    return (
      <>
        <svg
          viewBox="0 0 640 240"
          className="mx-auto mb-16 hidden w-full max-w-[640px] md:block"
          aria-hidden="true"
          style={reduced ? undefined : { overflow: "visible" }}
        >
          <defs>
            <radialGradient id="h-bg-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-accent-warm)" stopOpacity="0.07" />
              <stop offset="100%" stopColor="var(--color-accent-warm)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="h-line-1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-accent-warm)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--color-accent-warm)" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="h-line-2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-accent-warm)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--color-accent-violet)" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          <rect x="60" y="60" width="520" height="60" rx="30" fill="url(#h-bg-glow)" stroke="var(--color-accent-warm)" strokeOpacity={reduced ? 0.04 : 0.06} strokeWidth="1" />
          <rect x="68" y="68" width="504" height="44" rx="22" fill="none" stroke="var(--color-accent-warm)" strokeOpacity={reduced ? 0.02 : 0.03} strokeWidth="0.5" />

          <g transform="translate(20, 10)">

          <motion.path
            d="M74 90 Q180 95 286 90"
            stroke="url(#h-line-1)"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: seg1 ? 1 : 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          />

          <motion.path
            d="M286 90 Q406 95 526 90"
            stroke="url(#h-line-2)"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: seg2 ? 1 : 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          />

          <motion.g
            transform="translate(60, 90)"
            initial={{ scale: 0.85, opacity: 0.3 }}
            animate={{ scale: s1 ? 1 : 0.85, opacity: s1 ? 1 : 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <rect x="-14" y="-14" width="28" height="28" rx="3" fill="var(--color-accent-violet)" opacity={s1 ? 0.15 : 0.08} stroke="var(--color-accent-violet)" strokeWidth={1.5} />
            <path d="M-10 -14 L-10 -6 M-3 -14 L-3 -6 M4 -14 L4 -6 M-14 0 L14 0" stroke="var(--color-accent-violet)" strokeWidth={1.5} />
          </motion.g>

          <motion.g
            transform="translate(300, 90)"
            initial={{ scale: 0.85, opacity: 0.3 }}
            animate={{ scale: s2 ? 1 : 0.85, opacity: s2 ? 1 : 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <path d="M-3 -14 L3 -14 L5 4 L-5 4 Z M0 4 L0 12 M-8 12 L8 12" stroke="var(--color-accent-violet)" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>

          <motion.g
            transform="translate(540, 90)"
            initial={{ scale: 0.85, opacity: 0.3 }}
            animate={{ scale: s3 ? 1 : 0.85, opacity: s3 ? 1 : 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <path d="M-14 2 L-14 -6 L-6 -6 L-6 -12 L6 -12 L6 -6 L14 -6 L14 2 Q0 10 -14 2 Z" stroke="var(--color-accent-violet)" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>

          <motion.circle
            cx="74" cy="90" r="2.5"
            fill="var(--color-accent-warm)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: seg1 ? 1 : 0, scale: seg1 ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          />

          <motion.circle
            cx="286" cy="90" r="2.5"
            fill="var(--color-accent-warm)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: seg2 ? 1 : 0, scale: seg2 ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          />
          </g>
        </svg>

        <svg
          viewBox="0 0 180 440"
          className="mx-auto mb-16 block w-full max-w-[180px] md:hidden"
          aria-hidden="true"
          style={reduced ? undefined : { overflow: "visible" }}
        >
          <defs>
            <linearGradient id="v-line-1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent-warm)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--color-accent-warm)" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="v-line-2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent-warm)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--color-accent-violet)" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          <rect x="50" y="50" width="80" height="340" rx="40" fill="var(--color-accent-warm)" opacity={reduced ? 0.03 : 0.02} stroke="var(--color-accent-warm)" strokeOpacity={reduced ? 0.04 : 0.06} strokeWidth="1" />

          <g transform="translate(10, 20)">
          <motion.path
            d="M80 64 Q85 120 80 176"
            stroke="url(#v-line-1)"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: seg1 ? 1 : 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          />

          <motion.path
            d="M80 176 Q85 246 80 316"
            stroke="url(#v-line-2)"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: seg2 ? 1 : 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          />

          <motion.g
            transform="translate(80, 50)"
            initial={{ scale: 0.85, opacity: 0.3 }}
            animate={{ scale: s1 ? 1 : 0.85, opacity: s1 ? 1 : 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <rect x="-14" y="-14" width="28" height="28" rx="3" fill="var(--color-accent-violet)" opacity={s1 ? 0.15 : 0.08} stroke="var(--color-accent-violet)" strokeWidth={1.5} />
            <path d="M-10 -14 L-10 -6 M-3 -14 L-3 -6 M4 -14 L4 -6 M-14 0 L14 0" stroke="var(--color-accent-violet)" strokeWidth={1.5} />
          </motion.g>

          <motion.g
            transform="translate(80, 190)"
            initial={{ scale: 0.85, opacity: 0.3 }}
            animate={{ scale: s2 ? 1 : 0.85, opacity: s2 ? 1 : 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <path d="M-3 -14 L3 -14 L5 4 L-5 4 Z M0 4 L0 12 M-8 12 L8 12" stroke="var(--color-accent-violet)" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>

          <motion.g
            transform="translate(80, 330)"
            initial={{ scale: 0.85, opacity: 0.3 }}
            animate={{ scale: s3 ? 1 : 0.85, opacity: s3 ? 1 : 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <path d="M-14 2 L-14 -6 L-6 -6 L-6 -12 L6 -12 L6 -6 L14 -6 L14 2 Q0 10 -14 2 Z" stroke="var(--color-accent-violet)" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
          </g>
        </svg>

        <ol className="grid grid-cols-3 gap-8 text-center max-md:grid-cols-1 max-md:gap-16">
          <li ref={step1Ref}>
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={s1 ? { y: 0, opacity: 1 } : undefined}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="mb-4 flex justify-center">{nodes[0].icon}</div>
              <h3 className="mb-2 font-serif-jp text-2xl font-medium">{nodes[0].title}</h3>
              <p className="text-[var(--color-text-secondary)]">{nodes[0].description}</p>
            </motion.div>
          </li>
          <li ref={step2Ref}>
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={s2 ? { y: 0, opacity: 1 } : undefined}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="mb-4 flex justify-center">{nodes[1].icon}</div>
              <h3 className="mb-2 font-serif-jp text-2xl font-medium">{nodes[1].title}</h3>
              <p className="text-[var(--color-text-secondary)]">{nodes[1].description}</p>
            </motion.div>
          </li>
          <li ref={step3Ref}>
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={s3 ? { y: 0, opacity: 1 } : undefined}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="mb-4 flex justify-center">{nodes[2].icon}</div>
              <h3 className="mb-2 font-serif-jp text-2xl font-medium">{nodes[2].title}</h3>
              <p className="text-[var(--color-text-secondary)]">{nodes[2].description}</p>
            </motion.div>
          </li>
        </ol>
      </>
    );
  }
}
