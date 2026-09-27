import { useEffect, useRef } from "react";
import { Spots } from "./Spots";

// Words wrapped in *asterisks* are set in the italic serif.
const statement =
  "The serval is a wild cat with *oversized ears.* It hears what others miss, waits until it’s sure — then *pounces* with precision. That’s how we build software: listen closely, plan carefully, *move fast.*";

const notes = [
  {
    title: "Big ears",
    copy: "We listen first. Your goals, your users, and the way work really happens come before any code.",
    seed: 3,
  },
  {
    title: "The pounce",
    copy: "Focused, efficient builds. Short cycles, visible progress, nothing wasted.",
    seed: 8,
  },
  {
    title: "Unique spots",
    copy: "No two servals share the same coat. No two businesses share the same needs — so we build around yours.",
    seed: 14,
  },
];

export function Manifesto() {
  const text = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = text.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>(".w"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => w.classList.add("is-lit"));
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const start = window.innerHeight * 0.85;
      const end = window.innerHeight * 0.35;
      const progress = (start - rect.top) / (start - end + rect.height * 0.6);
      const lit = Math.round(Math.min(1, Math.max(0, progress)) * words.length);
      words.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const parts = statement.split(/(\*[^*]+\*)/).filter(Boolean);

  return (
    <section className="manifesto section" aria-labelledby="manifesto-title">
      <div className="wrap">
        <div className="section-head">
          <span className="label">(01)</span>
          <h2 id="manifesto-title" className="label">
            Why “Servalyn”
          </h2>
        </div>
        <p className="manifesto-text" ref={text}>
          {parts.map((part, i) => {
            const serif = part.startsWith("*");
            const words = part.replace(/\*/g, "").split(" ").filter(Boolean);
            return (
              <span key={i} className={serif ? "serif" : undefined}>
                {words.map((word, j) => (
                  <span key={j}>
                    <span className="w">{word}</span>{" "}
                  </span>
                ))}
              </span>
            );
          })}
        </p>
        <div className="notes">
          {notes.map((note, i) => (
            <article className="note" key={note.title} data-reveal>
              <Spots
                className="note-print"
                width={240}
                height={120}
                radius={60}
                seed={note.seed}
                cell={26}
                minR={3.5}
                maxR={8}
              />
              <span className="label">Field note {String(i + 1).padStart(2, "0")}</span>
              <h3>{note.title}</h3>
              <p>{note.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
