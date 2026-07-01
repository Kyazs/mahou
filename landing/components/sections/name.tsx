import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { Brushstroke } from "@/components/motifs/brushstroke";
import { HankoSeal } from "@/components/motifs/hanko-seal";

export function Name() {
  return (
    <section data-kanji="魔" className="panel-warm">
      <ScrollReveal className="relative mx-auto max-w-[72ch] px-8 py-32">
        <Brushstroke />
        <HankoSeal kanji="魔" renderOn={false} />
        <h2 className="mb-8 font-serif-jp text-5xl font-bold [text-wrap:balance]">
          The name
        </h2>
        <p className="text-xl text-[var(--color-text-secondary)] [text-wrap:pretty]">
          mahou (魔法) is Japanese for magic. Here, magic is the discipline of
          doing the right work in the right order — root cause before fix, design
          before code, verify before ship.
        </p>
      </ScrollReveal>
    </section>
  );
}
