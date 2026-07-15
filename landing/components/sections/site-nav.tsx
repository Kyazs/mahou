"use client";

import { useEffect, useState } from "react";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-b border-[var(--color-line)] bg-[color-mix(in_oklab,var(--color-bg)_88%,transparent)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-[clamp(1.25rem,4vw,2.75rem)] py-3.5"
        aria-label="Primary"
      >
        <a
          href="#top"
          className="group flex items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-[var(--color-accent-brass)] focus-visible:outline-offset-4"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-[3px] bg-[var(--color-accent-seal)] font-jp text-sm font-medium text-[#fff6ee] shadow-[0_0_22px_rgba(212,59,42,0.4)]"
            aria-hidden="true"
          >
            魔
          </span>
          <span className="text-sm font-semibold tracking-tight">mahou</span>
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href="#doctrine"
            className="hidden rounded-sm px-3 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent-brass)] focus-visible:outline-offset-2 md:inline-flex"
          >
            Doctrine
          </a>
          <a
            href="#commands"
            className="hidden rounded-sm px-3 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent-brass)] focus-visible:outline-offset-2 md:inline-flex"
          >
            Commands
          </a>
          <a
            href="https://github.com/Kyazs/mahou"
            className="hidden rounded-sm px-3 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent-brass)] focus-visible:outline-offset-2 sm:inline-flex"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a href="#install" className="btn-primary !px-4 !py-2 !text-sm">
            Install
          </a>
        </div>
      </nav>
    </header>
  );
}
