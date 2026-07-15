"use client";

import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
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
  {
    type: "command",
    prompt: "$",
    text: "git clone https://github.com/Kyazs/mahou.git",
    copyText: "git clone https://github.com/Kyazs/mahou.git",
  },
  { type: "command", prompt: "$", text: "cd mahou", copyText: "cd mahou" },
  {
    type: "command",
    prompt: "$",
    text: ".\\install.ps1",
    comment: "# Windows",
    copyText: ".\\install.ps1",
  },
  {
    type: "command",
    prompt: "$",
    text: "./install.sh",
    comment: "# macOS / Linux",
    copyText: "./install.sh",
  },
  {
    type: "comment",
    text: "# Typical workflow",
    copyText: "# Typical workflow",
  },
  {
    type: "command",
    prompt: ">",
    text: "/mahou-brainstorm add real-time notifications",
    copyText: "/mahou-brainstorm add real-time notifications",
  },
  {
    type: "command",
    prompt: ">",
    text: "/mahou-orchestrator ./.mahou/plans/<uuid>.md",
    copyText: "/mahou-orchestrator ./.mahou/plans/<uuid>.md",
  },
  {
    type: "command",
    prompt: ">",
    text: "/mahou-verify",
    copyText: "/mahou-verify",
  },
  { type: "command", prompt: ">", text: "/mahou-ship", copyText: "/mahou-ship" },
];

const TYPE_SPEED_MS = 26;

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
      { threshold: 0.25 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [prefersReducedMotion]);

  const allDone = Boolean(prefersReducedMotion) || visibleLines >= LINES.length;

  return (
    <section id="install" data-kanji="始" className="panel-edge">
      <ScrollReveal className="section-shell">
        <div className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="seal-dot" />
              <span className="font-jp text-sm tracking-[0.2em] text-[var(--color-accent-brass)]">
                始 · begin
              </span>
            </div>
            <h2 className="display-title mb-5">Install in one breath</h2>
            <p className="lead">
              Clone, run the installer, restart opencode. No plugins. No MCP. No
              npm. Just slash commands that enforce the craft.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <a
              href="https://github.com/Kyazs/mahou"
              className="btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Clone on GitHub
            </a>
            <a
              href="https://github.com/Kyazs/mahou/blob/main/README.md"
              className="btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Full docs
            </a>
          </div>
        </div>

        <div
          ref={containerRef}
          className="overflow-hidden border border-[color-mix(in_oklab,var(--color-accent-seal)_30%,transparent)] bg-[#0c0a09] shadow-[0_0_90px_rgba(212,59,42,0.08)]"
        >
          <div className="flex items-center justify-between gap-4 border-b border-[var(--color-line)] bg-[rgba(255,255,255,0.02)] px-4 py-3">
            <div className="flex gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[rgba(212,59,42,0.7)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[rgba(201,160,106,0.65)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[rgba(138,131,120,0.55)]" />
            </div>
            <span className="font-mono text-[0.65rem] tracking-[0.16em] text-[var(--color-text-faint)]">
              terminal · mahou
            </span>
          </div>
          <div className="overflow-x-auto p-6 font-mono text-[0.875rem] leading-7 sm:p-8 sm:text-[0.9rem]">
            {LINES.map((line, index) => {
              if (!prefersReducedMotion && index > visibleLines) return null;
              const isCurrentLine = index === visibleLines && !allDone;
              const isFullyTyped = index < visibleLines || allDone;
              const displayedText = isFullyTyped
                ? line.text
                : line.text.slice(0, typedChars);

              return (
                <div key={index} className="group flex items-center gap-2">
                  <div className="min-w-0 flex-1 whitespace-nowrap max-md:whitespace-pre-wrap max-md:break-all">
                    {line.type === "comment" && (
                      <span className="text-[var(--color-text-faint)]">
                        {displayedText}
                      </span>
                    )}
                    {line.type === "command" && (
                      <>
                        <span className="font-semibold text-[var(--color-accent-seal)]">
                          {line.prompt}
                        </span>{" "}
                        <span className="text-[var(--color-accent-brass)]">
                          {displayedText}
                        </span>
                        {line.comment && isFullyTyped && (
                          <span className="text-[var(--color-text-faint)]">
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
                          backgroundColor: "var(--color-accent-brass)",
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
