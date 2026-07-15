import { SiteNav } from "@/components/sections/site-nav";
import { Hero } from "@/components/sections/hero";
import { Name } from "@/components/sections/name";
import { Philosophy } from "@/components/sections/philosophy";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Workflow } from "@/components/sections/workflow";
import { Commands } from "@/components/sections/commands";
import { QuickStart } from "@/components/sections/quick-start";
import { Footer } from "@/components/sections/footer";
import { InkThread } from "@/components/motifs/ink-thread";

export default function Home() {
  return (
    <>
      <InkThread />
      <SiteNav />
      <main className="relative z-10">
        <Hero />
        <Name />
        <Philosophy />
        <HowItWorks />
        <Workflow />
        <Commands />
        <QuickStart />
        <Footer />
      </main>
    </>
  );
}
