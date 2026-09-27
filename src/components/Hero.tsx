import { useEffect, useState } from "react";
import { HeroPreview } from "./HeroPreview";
import { services } from "../content";
import { prefersReducedMotion } from "../hooks/usePageFx";

const COUNT = services.length;

export function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Cycle through what we build, unless the visitor is exploring the index.
  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setActive((i) => (i + 1) % COUNT);
    }, 2800);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div className="hero-meta label">
          <span>(Web design &amp; software studio)</span>
          <a href="#services" className="hero-scroll">
            Scroll to explore <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="hero-stage">
          <h1 className="hero-title">
            <span className="hero-line hero-line-1">
              <span className="rise">Software</span>
            </span>
            <span className="hero-line hero-line-2">
              <span
                className="rise hero-window"
                data-cursor="Next"
                onClick={() => setActive((i) => (i + 1) % COUNT)}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                <HeroPreview active={active} />
              </span>
              <span className="rise">that</span>
            </span>
            <span className="hero-line hero-line-3">
              <span className="rise">
                <em>pounces.</em>
              </span>
            </span>
          </h1>
          <nav
            className="hero-index"
            aria-label="Services"
            onMouseLeave={() => setPaused(false)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
            }}
          >
            <span className="label">What we build</span>
            <ol>
              {services.map((s, i) => (
                <li key={s.id} style={{ ["--d" as string]: `${500 + i * 70}ms` }}>
                  <a
                    href={`#service-${s.id}`}
                    className={i === active ? "is-active" : undefined}
                    onMouseEnter={() => {
                      setPaused(true);
                      setActive(i);
                    }}
                    onFocus={() => {
                      setPaused(true);
                      setActive(i);
                    }}
                  >
                    <span className="label">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                    <span className="hero-index-arrow" aria-hidden="true">→</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="hero-foot">
          <p className="hero-lede">
            <strong>Servalyn</strong> is a digital studio. We design and build
            websites, custom software, automation, and AI for organizations that
            want to move faster — and land precisely.
          </p>
          <div className="hero-actions">
            <a className="pill pill-orange" href="#contact" data-magnetic>
              Start a project <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href="#services">
              See what we do <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
