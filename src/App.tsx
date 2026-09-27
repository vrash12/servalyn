import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Manifesto } from "./components/Manifesto";
import { Services } from "./components/Services";
import { Work } from "./components/Work";
import { Approach } from "./components/Approach";
import { Build } from "./components/Build";
import { Principles } from "./components/Principles";
import { Faq } from "./components/Faq";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Dock } from "./components/Dock";
import { Cursor } from "./components/Cursor";
import { usePageFx, prefersReducedMotion } from "./hooks/usePageFx";

const serviceToInterest: Record<string, string> = {
  Websites: "Website",
  "Custom software": "Custom software",
  "Mobile apps": "Mobile app",
  Automation: "Automation",
  "AI solutions": "AI solution",
  "Integrations & cloud": "Integrations & cloud",
};

function goToContact() {
  document
    .getElementById("contact")
    ?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  window.setTimeout(() => document.getElementById("c-name")?.focus({ preventScroll: true }), 500);
}

export default function App() {
  const [picks, setPicks] = useState<string[]>([]);
  // A fresh object on every request, so choosing the same service twice still applies.
  const [interest, setInterest] = useState<{ value: string } | null>(null);

  usePageFx();

  const togglePick = (item: string) =>
    setPicks((p) => (p.includes(item) ? p.filter((x) => x !== item) : [...p, item]));
  const clearPicks = () => setPicks([]);

  return (
    <>
      <Header pickCount={picks.length} />
      <main id="main">
        <Hero />
        <Marquee />
        <Manifesto />
        <Services
          onDiscuss={(service) => {
            setInterest({ value: serviceToInterest[service] ?? "" });
            goToContact();
          }}
        />
        <Work />
        <Approach />
        <Build picked={picks} onToggle={togglePick} onClear={clearPicks} />
        <Principles />
        <Faq />
        <Contact
          interest={interest}
          picks={picks}
          onRemovePick={togglePick}
          onClearPicks={clearPicks}
        />
      </main>
      <Footer />
      <Dock picks={picks} onClear={clearPicks} />
      <Cursor />
    </>
  );
}
