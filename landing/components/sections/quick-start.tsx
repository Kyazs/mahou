"use client";

import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { Brushstroke } from "@/components/motifs/brushstroke";
import { HankoSeal } from "@/components/motifs/hanko-seal";
import { CopyButton } from "@/components/effects/copy-button";

interface TerminalLine {
  type: "comment" | "command";
  prompt?: string;
  text: string;
  comment?: string;
  copyText: string;
}

const LINES: TerminalLine[] = [
  { type: "comment", text: "# Install", copyText: "# Install" },
  { type: "command", prompt: "$", text: "cd mahou", copyText: "cd mahou" },
  { type: "command", prompt: "$", text: ".\\install.ps1", comment: "# Windows", copyText: ".\\install.ps1" },
  { type: "command", prompt: "$", text: "./install.sh", comment: "# macOS / Linux", copyText: "./install.sh" },
  { type: "comment", text: "# Typical workflow", copyText: "# Typical workflow" },
  { type: "command", prompt: ">", text: "/mahou-brainstorm add real-time notifications", copyText: "/mahou-brainstorm add real-time notifications" },
  { type: "command", prompt: ">", text: "/mahou-orchestrator ./.mahou/plans/<uuid>.md", copyText: "/mahou-orchestrator ./.mahou/plans/<uuid>.md" },
  { type: "command", prompt: ">", text: "/mahou-verify", copyText: "/mahou-verify" },
  { type: "command", prompt: ">", text: "/mahou-ship", copyText: "/mahou-ship" },
];

const TYPE_SPEED_MS = 30;

export function QuickStart() {
  const prefersReducedMotion = useReducedMotion();
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [typedChars, setTypedChars] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startTyping() {
    let lineIdx = 0;
    let charIdx = 0;

    intervalRef.current = setInterval(() => {
      if (lineIdx >= LINES.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      const line = LINES[lineIdx];
      charIdx++;

      if (charIdx > line.text.length) {
        lineIdx++;
        charIdx = 0;
        setVisibleLines(lineIdx);
      } else {
        setVisibleLines(lineIdx);
        setTypedChars(charIdx);
      }
    }, TYPE_SPEED_MS);
  }

  useEffect(() => {
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          startTyping();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [prefersReducedMotion]);

  const allDone = Boolean(prefersReducedMotion) || visibleLines >= LINES.length;

  return (
    <section data-kanji="始" className="panel-cold">
      <ScrollReveal className="relative mx-auto max-w-[72ch] px-8 py-32">
        <Brushstroke />
        <HankoSeal kanji="始" renderOn={false} />
        <h2 className="mb-8 font-serif-jp text-5xl font-bold [text-wrap:balance]">
          Quick start
        </h2>
        <div
          ref={containerRef}
          className="overflow-hidden rounded-xl border border-[rgba(109,74,255,0.18)] bg-[#0e0e14]"
        >
          <div className="flex gap-2 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[rgba(197,69,69,0.5)]" />
            <span className="h-3 w-3 rounded-full bg-[rgba(255,184,108,0.5)]" />
            <span className="h-3 w-3 rounded-full bg-[rgba(109,74,255,0.5)]" />
          </div>
          <div className="overflow-x-auto p-8 font-mono text-[0.9rem] leading-7 max-md:text-[0.8rem]">
            {LINES.map((line, index) => {
              if (!prefersReducedMotion && index > visibleLines) return null;
              const isCurrentLine = index === visibleLines && !allDone;
              const isFullyTyped = index < visibleLines || allDone;
              const displayedText = isFullyTyped
                ? line.text
                : line.text.slice(0, typedChars);

              return (
                <div key={index} className="group flex items-center gap-2">
                  <div className="flex-1 whitespace-nowrap max-md:whitespace-pre-wrap max-md:break-all">
                    {line.type === "comment" && (
                      <span className="text-[var(--color-text-secondary)]">
                        {displayedText}
                      </span>
                    )}
                    {line.type === "command" && (
                      <>
                        <span className="font-semibold text-[var(--color-accent-violet)]">
                          {line.prompt}
                        </span>{" "}
                        <span className="text-[var(--color-accent-warm)]">
                          {displayedText}
                        </span>
                        {line.comment && isFullyTyped && (
                          <span className="text-[var(--color-text-secondary)]">
                            {"  "}
                            {line.comment}
                          </span>
                        )}
                      </>
                    )}
                    {isCurrentLine && (
                      <span
                        className="ml-0.5 inline-block h-[14px] w-[7px] align-[-2px]"
                        style={{
                          backgroundColor: "var(--color-accent-warm)",
                          animation: "cursor-blink 1s step-end infinite",
                        }}
                      />
                    )}
                  </div>
                  {isFullyTyped && line.type === "command" && (
                    <CopyButton
                      text={line.copyText}
                      className="opacity-0 transition-opacity group-hover:opacity-100 max-md:opacity-100"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
