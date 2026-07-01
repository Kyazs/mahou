"use client";

import { motion, useReducedMotion, useInView } from "motion/react";
import { useRef } from "react";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { Brushstroke } from "@/components/motifs/brushstroke";
import { HankoSeal } from "@/components/motifs/hanko-seal";

const steps = [
  { command: "/mahou-brainstorm", description: "Design to spec before code." },
  { command: "/mahou-orchestrator", description: "Execute the plan task-by-task." },
  { command: "/mahou-verify", description: "Check implementation against spec." },
  { command: "/mahou-ship", description: "Push, create PR, ship it." },
];

export function Workflow() {
  const prefersReducedMotion = useReducedMotion();

  const cardRef0 = useRef<HTMLDivElement>(null);
  const cardRef1 = useRef<HTMLDivElement>(null);
  const cardRef2 = useRef<HTMLDivElement>(null);
  const cardRef3 = useRef<HTMLDivElement>(null);

  const viewportOpts = { rootMargin: "-20% 0px -20% 0px", amount: 0.3 as const, once: true };
  const card0View = useInView(cardRef0, viewportOpts);
  const card1View = useInView(cardRef1, viewportOpts);
  const card2View = useInView(cardRef2, viewportOpts);
  const card3View = useInView(cardRef3, viewportOpts);

  const mainDrawn = prefersReducedMotion || card0View || card1View;
  const passDrawn = prefersReducedMotion || card3View;
  const fixDrawn = prefersReducedMotion || card2View;
  const replanDrawn = prefersReducedMotion || card2View;

  if (prefersReducedMotion) {
    return (
      <section data-kanji="輪" className="panel-cold">
        <ScrollReveal className="relative mx-auto max-w-[72ch] px-8 py-32">
          <Brushstroke />
          <HankoSeal kanji="輪" renderOn={false} />
          <h2 className="mb-8 font-serif-jp text-5xl font-bold [text-wrap:balance]">The workflow</h2>
          <div className="flex flex-col items-center py-16">{renderDiagram(true)}</div>
        </ScrollReveal>
      </section>
    );
  }

  return (
    <section data-kanji="輪" className="panel-cold">
      <ScrollReveal className="relative mx-auto max-w-[72ch] px-8 py-32">
        <Brushstroke />
        <HankoSeal kanji="輪" renderOn={false} />
        <h2 className="mb-8 font-serif-jp text-5xl font-bold [text-wrap:balance]">
          The workflow
        </h2>
        <div className="flex flex-col items-center py-16">
          {renderDiagram(false, mainDrawn, passDrawn, fixDrawn, replanDrawn)}
        </div>
      </ScrollReveal>
    </section>
  );

  function renderDiagram(
    reduced: boolean,
    main = false,
    pass = false,
    fix = false,
    replan = false
  ) {
    return (
      <>
        <svg
          viewBox="0 0 560 440"
          className="mb-16 w-full max-w-[560px]"
          aria-hidden="true"
          style={reduced ? undefined : { overflow: "visible" }}
        >
          <defs>
            <radialGradient id="w-bg-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-accent-violet)" stopOpacity="0.06" />
              <stop offset="100%" stopColor="var(--color-accent-violet)" stopOpacity="0" />
            </radialGradient>
            <filter id="w-glow-violet">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="w-glow-warm">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <rect x="20" y="20" width="520" height="400" rx="36" fill="url(#w-bg-glow)" stroke="var(--color-accent-violet)" strokeOpacity={reduced ? 0.04 : 0.06} strokeWidth="1" />
          <rect x="28" y="28" width="504" height="384" rx="28" fill="none" stroke="var(--color-accent-violet)" strokeOpacity={reduced ? 0.02 : 0.03} strokeWidth="0.5" />

          <g transform="translate(30, 20)">
          <motion.path
            d="M250 50 L420 200 L250 350 L80 200 Z"
            stroke="var(--color-accent-violet)"
            strokeWidth={2}
            fill="none"
            strokeDasharray="8 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: main ? 1 : 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          />

          <motion.path
            d="M420 200 L470 200"
            stroke="var(--color-accent-warm)"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: pass ? 1 : 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.polygon
            points="465,195 478,200 465,205"
            fill="var(--color-accent-warm)"
            initial={{ opacity: 0 }}
            animate={{ opacity: pass ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          />

          <motion.path
            d="M420 200 L470 280"
            stroke="var(--color-accent-crimson)"
            strokeWidth={2.5}
            fill="none"
            strokeDasharray="6 3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: fix ? 1 : 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.polygon
            points="465,275 478,280 465,285"
            fill="var(--color-accent-crimson)"
            initial={{ opacity: 0 }}
            animate={{ opacity: fix ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          />

          <motion.path
            d="M80 200 L40 140 L40 80 L250 50"
            stroke="var(--color-accent-violet)"
            strokeWidth={2}
            fill="none"
            strokeDasharray="4 4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: replan ? 1 : 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          <motion.polygon
            points="246,46 250,50 246,54"
            fill="var(--color-accent-violet)"
            initial={{ opacity: 0 }}
            animate={{ opacity: replan ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          />

          <motion.circle cx="250" cy="50" r="7" fill="var(--color-accent-violet)" initial={{ r: 5 }} animate={{ r: main ? 7 : 5, opacity: main ? 1 : 0.5 }} transition={{ duration: 0.4 }} />
          <motion.circle cx="420" cy="200" r="7" fill="var(--color-accent-violet)" initial={{ r: 5 }} animate={{ r: main ? 7 : 5, opacity: main ? 1 : 0.5 }} transition={{ duration: 0.4 }} />
          <motion.circle cx="250" cy="350" r="7" fill="var(--color-accent-violet)" initial={{ r: 5 }} animate={{ r: main ? 7 : 5, opacity: main ? 1 : 0.5 }} transition={{ duration: 0.4 }} />
          <motion.circle cx="80" cy="200" r="7" fill="var(--color-accent-violet)" initial={{ r: 5 }} animate={{ r: main ? 7 : 5, opacity: main ? 1 : 0.5 }} transition={{ duration: 0.4 }} />

          <motion.circle cx="478" cy="200" r="5" fill="var(--color-accent-warm)" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: pass ? 1 : 0, scale: pass ? 1 : 0 }} transition={{ duration: 0.4, delay: 0.3 }} />
          <motion.circle cx="478" cy="280" r="5" fill="var(--color-accent-crimson)" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: fix ? 1 : 0, scale: fix ? 1 : 0 }} transition={{ duration: 0.4, delay: 0.3 }} />

          <motion.text
            x="250" y="42"
            textAnchor="middle"
            fill="var(--color-accent-violet)"
            fontSize="9"
            fontFamily="var(--font-sans)"
            opacity={0.7}
            initial={{ opacity: 0 }}
            animate={{ opacity: main ? 0.7 : 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Brainstorm
          </motion.text>
          <motion.text
            x="425" y="192"
            textAnchor="start"
            fill="var(--color-accent-violet)"
            fontSize="9"
            fontFamily="var(--font-sans)"
            opacity={0.7}
            initial={{ opacity: 0 }}
            animate={{ opacity: main ? 0.7 : 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            Orchestrate
          </motion.text>
          <motion.text
            x="250" y="368"
            textAnchor="middle"
            fill="var(--color-accent-violet)"
            fontSize="9"
            fontFamily="var(--font-sans)"
            opacity={0.7}
            initial={{ opacity: 0 }}
            animate={{ opacity: main ? 0.7 : 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Verify
          </motion.text>

          <motion.text
            x="488" y="203"
            textAnchor="start"
            fill="var(--color-accent-warm)"
            fontSize="9"
            fontFamily="var(--font-sans)"
            initial={{ opacity: 0 }}
            animate={{ opacity: pass ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            Ship
          </motion.text>
          <motion.text
            x="488" y="283"
            textAnchor="start"
            fill="var(--color-accent-crimson)"
            fontSize="9"
            fontFamily="var(--font-sans)"
            initial={{ opacity: 0 }}
            animate={{ opacity: fix ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            Debug
          </motion.text>
          <motion.text
            x="38" y="95"
            textAnchor="end"
            fill="var(--color-accent-violet)"
            fontSize="8"
            fontFamily="var(--font-sans)"
            opacity={0.6}
            initial={{ opacity: 0 }}
            animate={{ opacity: replan ? 0.6 : 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            replan
          </motion.text>
          </g>
        </svg>

        <div className="grid w-full max-w-[600px] grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6">
          <div ref={cardRef0}>
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={card0View ? { y: 0, opacity: 1 } : undefined}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <code className="mb-1 block font-mono text-[0.95rem] text-[var(--color-accent-warm)]">{steps[0].command}</code>
              <p className="text-sm text-[var(--color-text-secondary)]">{steps[0].description}</p>
            </motion.div>
          </div>
          <div ref={cardRef1}>
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={card1View ? { y: 0, opacity: 1 } : undefined}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <code className="mb-1 block font-mono text-[0.95rem] text-[var(--color-accent-warm)]">{steps[1].command}</code>
              <p className="text-sm text-[var(--color-text-secondary)]">{steps[1].description}</p>
            </motion.div>
          </div>
          <div ref={cardRef2}>
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={card2View ? { y: 0, opacity: 1 } : undefined}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <code className="mb-1 block font-mono text-[0.95rem] text-[var(--color-accent-warm)]">{steps[2].command}</code>
              <p className="text-sm text-[var(--color-text-secondary)]">{steps[2].description}</p>
            </motion.div>
          </div>
          <div ref={cardRef3}>
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={card3View ? { y: 0, opacity: 1 } : undefined}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <code className="mb-1 block font-mono text-[0.95rem] text-[var(--color-accent-warm)]">{steps[3].command}</code>
              <p className="text-sm text-[var(--color-text-secondary)]">{steps[3].description}</p>
            </motion.div>
          </div>
        </div>
      </>
    );
  }
}
