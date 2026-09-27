import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../hooks/usePageFx";

const words = [
  "Websites",
  "Web apps",
  "Mobile apps",
  "Automation",
  "AI assistants",
  "Integrations",
  "Dashboards",
  "Cloud",
];

function Track({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  // Two identical halves make a seamless loop.
  const run = [...items, ...items];
  return (
    <div className={`tape-track ${reverse ? "is-reverse" : ""}`}>
      {[0, 1].map((half) => (
        <span className="tape-half" key={half}>
          {run.map((word, i) => (
            <span className="tape-item" key={`${half}-${i}`}>
              {word}
              <span className="tape-star" aria-hidden="true">
                ✺
              </span>
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The tapes follow your scroll: faster when you scroll fast, reversing when you scroll up.
    const el = root.current;
    if (!el || prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    const animations = () => Array.from(el.querySelectorAll(".tape-track")).flatMap((t) => t.getAnimations());
    let visible = false;
    let frame = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let dir = 1;
    let rate = 1;
    let boost = 0;

    const loop = (now: number) => {
      const y = window.scrollY;
      const dt = Math.max(1, now - lastT);
      const v = (y - lastY) / dt; // px per ms
      if (Math.abs(v) > 0.02) dir = v > 0 ? 1 : -1;
      boost = Math.max(boost * 0.92, Math.min(Math.abs(v) * 4, 5));
      const target = dir * (1 + boost);
      rate += (target - rate) * 0.12;
      animations().forEach((a) => (a.playbackRate = rate));
      el.style.setProperty("--skew", (Math.max(-1, Math.min(1, v * 0.6)) * -6).toFixed(2));
      lastY = y;
      lastT = now;
      frame = visible ? requestAnimationFrame(loop) : 0;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) {
        lastY = window.scrollY;
        lastT = performance.now();
        frame = requestAnimationFrame(loop);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="tapes" ref={root}>
      <p className="sr-only">We make {words.join(", ")}.</p>
      <div className="tape tape-orange" aria-hidden="true">
        <Track items={[...words].reverse()} reverse />
      </div>
      <div className="tape tape-ink" aria-hidden="true">
        <Track items={words} />
      </div>
    </div>
  );
}
