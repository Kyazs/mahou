"use client";

import { useEffect, useRef, useState } from "react";

interface SeigaihaWavesProps {
  position?: "top" | "bottom";
  className?: string;
}

export function SeigaihaWaves({
  position = "bottom",
  className = "",
}: SeigaihaWavesProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const wavePath =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30' viewBox='0 0 60 30'%3E%3Cg fill='none' stroke='%23ffb86c' stroke-width='1.5'%3E%3Cpath d='M0 30 A15 15 0 0 1 30 30 A15 15 0 0 1 60 30'/%3E%3Cpath d='M0 30 A10 10 0 0 1 20 30 A10 10 0 0 1 40 30 A10 10 0 0 1 60 30'/%3E%3Cpath d='M0 30 A5 5 0 0 1 10 30 A5 5 0 0 1 20 30 A5 5 0 0 1 30 30 A5 5 0 0 1 40 30 A5 5 0 0 1 50 30 A5 5 0 0 1 60 30'/%3E%3C/g%3E%3C/svg%3E";

  return (
    <div
      ref={ref}
      className={`pointer-events-none ${className}`}
      style={{
        position: "absolute",
        left: 0,
        width: "100%",
        height: position === "bottom" ? "60px" : "30px",
        bottom: position === "bottom" ? 0 : "auto",
        top: position === "top" ? 0 : "auto",
        backgroundImage: visible ? `url("${wavePath}")` : "none",
        backgroundSize: "60px 30px",
        backgroundRepeat: "repeat-x",
        opacity: 0.12,
      }}
      aria-hidden="true"
    />
  );
}
