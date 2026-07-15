"use client";

import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { useEffect, useState } from "react";

interface ActiveSection {
  kanji: string;
  y: number;
}

export function InkThread() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const absVelocity = useTransform(scrollVelocity, (v) => Math.abs(v));
  const strokeWidth = useTransform(absVelocity, [0, 800, 2000], [3, 1.5, 1]);
  const blurFilter = useTransform(absVelocity, [0, 800, 2000], [0, 1, 2]);
  const kanjiOpacity = useTransform(absVelocity, [0, 300], [1, 0]);
  const blurPx = useTransform(blurFilter, (v) => `blur(${v}px)`);

  const [activeSection, setActiveSection] = useState<ActiveSection | null>(
    null
  );

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const sections = document.querySelectorAll("section[data-kanji]");
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: ActiveSection | null = null;
        let bestRatio = 0;
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            best = {
              kanji: entry.target.getAttribute("data-kanji") || "",
              y:
                entry.boundingClientRect.top +
                entry.boundingClientRect.height / 2,
            };
            bestRatio = entry.intersectionRatio;
          }
        }
        if (best) setActiveSection(best);
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: "-20% 0px -20% 0px",
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  if (isMobile) {
    return (
      <div
        className="pointer-events-none fixed bottom-6 right-6 z-50"
        aria-hidden="true"
      >
        <span
          className="font-jp text-2xl"
          style={{
            color: "var(--color-accent-seal)",
            opacity: activeSection ? 0.55 : 0,
            textShadow: "0 0 10px rgba(212, 59, 42, 0.25)",
            transition: "opacity 0.3s ease",
          }}
        >
          {activeSection?.kanji || ""}
        </span>
      </div>
    );
  }

  if (prefersReducedMotion) {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-0 hidden md:block"
        aria-hidden="true"
      >
        <svg className="h-full w-full" aria-hidden="true">
          <line
            x1="24"
            y1="0"
            x2="24"
            y2="100%"
            stroke="rgba(212,59,42,0.1)"
            strokeWidth={2}
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 hidden md:block"
      aria-hidden="true"
    >
      <svg className="h-full w-full" aria-hidden="true">
        <motion.line
          x1="24"
          y1="0"
          x2="24"
          y2="100%"
          stroke="rgba(212,59,42,0.14)"
          style={{ strokeWidth, filter: blurPx }}
        />
        {activeSection && (
          <motion.text
            x="24"
            y={activeSection.y}
            textAnchor="middle"
            fontFamily="var(--font-jp), sans-serif"
            fontSize="22"
            fill="var(--color-accent-seal)"
            style={{
              opacity: kanjiOpacity,
            }}
          >
            {activeSection.kanji}
          </motion.text>
        )}
      </svg>
    </div>
  );
}
