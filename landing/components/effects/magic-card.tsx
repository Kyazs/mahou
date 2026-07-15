"use client";

import { useRef, useState, type ReactNode } from "react";

interface MagicCardProps {
  children: ReactNode;
  className?: string;
}

export function MagicCard({ children, className = "" }: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-xl bg-[var(--color-surface)] transition-transform duration-150 hover:-translate-y-0.5 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        boxShadow: isHovering
          ? `0 8px 24px rgba(201, 160, 106, 0.12)`
          : "none",
      }}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(200px circle at ${mousePos.x}px ${mousePos.y}px, rgba(201, 160, 106, 0.08), transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
