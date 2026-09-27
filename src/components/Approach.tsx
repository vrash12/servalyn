import { useEffect, useRef, useState } from "react";
import { approach } from "../content";

export function Approach() {
  const [current, setCurrent] = useState(0);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const steps = Array.from(el.querySelectorAll<HTMLElement>(".step"));

    // One scroll handler drives everything, so the line, the highlighted word,
    // the stage meter and the active step always agree. A step becomes current
    // when its top crosses the middle of the screen — exactly where the line's
    // fill has reached.
    let frame = 0;
    const update = () => {
      frame = 0;
      const mid = window.innerHeight * 0.5;
      const r = el.getBoundingClientRect();
      const fill = Math.min(1, Math.max(0, (mid - r.top) / r.height));
      el.style.setProperty("--fill", fill.toFixed(4));
      let active = 0;
      steps.forEach((step, i) => {
        if (step.getBoundingClientRect().top <= mid) active = i;
      });
      setCurrent(active);
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

  const word = (i: number, text: string, serif = false) => (
    <span className={`approach-word ${current === i ? "is-current" : ""} ${i < current ? "is-done" : ""}`}>
      {serif ? <em>{text}</em> : text}
    </span>
  );

  return (
    <section className="approach section" id="approach" aria-labelledby="approach-title">
      <div className="wrap approach-grid">
        <div className="approach-aside">
          <div className="section-head">
            <span className="label">(04)</span>
            <span className="label">Approach</span>
          </div>
          <h2 id="approach-title" className="display">
            {word(0, "Listen.")}
            <br />
            {word(1, "Map.")} {word(2, "Build.")}
            <br />
            {word(3, "Launch.")} {word(4, "Stay.", true)}
          </h2>
          <p>
            Five stages, one shared rhythm. You always know what’s happening,
            what’s next, and why.
          </p>
          <div className="stage-meter" aria-hidden="true">
            {approach.map((step, i) => (
              <span key={step.word} className={i <= current ? "is-done" : undefined} />
            ))}
            <b className="label">
              Stage {String(current + 1).padStart(2, "0")} / {String(approach.length).padStart(2, "0")} · {approach[current].word}
            </b>
          </div>
        </div>
        <ol className="steps" ref={list}>
          <span className="steps-line" aria-hidden="true" />
          {approach.map((step, i) => (
            <li
              className={`step ${current === i ? "is-current" : ""} ${i < current ? "is-done" : ""}`}
              key={step.word}
              data-reveal
            >
              <span className="step-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{step.word}</h3>
                <p>{step.copy}</p>
                <p className="step-outcome">
                  <span className="label">You get</span> {step.outcome}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
