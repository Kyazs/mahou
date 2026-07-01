"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
      } catch {
        /* no-op */
      }
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy command"
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent-warm)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent-warm)] focus-visible:outline-offset-2 ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-[var(--color-accent-warm)]" />
          <span className="text-[var(--color-accent-warm)]">Copied!</span>
        </>
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
