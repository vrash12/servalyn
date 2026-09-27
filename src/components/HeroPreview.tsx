/**
 * The hero's "window": a tiny, live preview of the kind of software we build.
 * It cycles through the six services and follows whichever one you hover in
 * the hero index, so the headline's "Software" always has a concrete example.
 * Decorative (aria-hidden) — the index next to it carries the real links.
 */

/**
 * Text inside the preview is drawn with CSS (::before + attr) rather than real
 * text nodes. The preview lives inside the <h1>, and this keeps the heading's
 * text — what search engines read — as just "Software that pounces."
 */
function T({ t }: { t: string }) {
  return <span className="pv-t" data-t={t} />;
}

export const previewLabels = [
  "Website",
  "Custom software",
  "Mobile app",
  "Automation",
  "AI assistant",
  "Integrations",
];

function Website() {
  return (
    <div className="pv-card pv-web">
      <div className="pv-bar">
        <i /><i /><i />
        <span className="pv-url" />
      </div>
      <div className="pv-web-body">
        <div className="pv-web-nav">
          <b /> <span /><span /><span />
        </div>
        <div className="pv-web-hero">
          <div>
            <span className="pv-line w90 thick" />
            <span className="pv-line w70 thick" />
            <span className="pv-line w60" />
            <span className="pv-btn" />
          </div>
          <div className="pv-web-img" />
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="pv-card pv-dash">
      <div className="pv-dash-side">
        <b />
        <span /><span /><span /><span />
      </div>
      <div className="pv-dash-main">
        <div className="pv-kpis">
          <div><span className="pv-line w50" /><strong><T t="128" /></strong></div>
          <div><span className="pv-line w60" /><strong><T t="94%" /></strong></div>
          <div><span className="pv-line w40" /><strong><T t="12" /></strong></div>
        </div>
        <div className="pv-chart">
          {[42, 64, 38, 80, 56, 92, 70].map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Mobile() {
  return (
    <div className="pv-mobile">
      <div className="pv-phone">
        <span className="pv-notch" />
        <span className="pv-line w60 thick" />
        {[0, 1, 2].map((i) => (
          <div className="pv-row" key={i}>
            <i />
            <span className="pv-line w70" />
          </div>
        ))}
        <span className="pv-btn wide" />
      </div>
      <div className="pv-phone back">
        <span className="pv-notch" />
        <div className="pv-ring" />
        <span className="pv-line w50" />
      </div>
    </div>
  );
}

function Automation() {
  return (
    <div className="pv-flow">
      {["Request", "Approve", "Done"].map((step, i) => (
        <div className="pv-flow-step" key={step} style={{ ["--n" as string]: i }}>
          <div className="pv-node">
            <b><T t={i === 2 ? "✓" : String(i + 1)} /></b>
          </div>
          <span><T t={step} /></span>
        </div>
      ))}
    </div>
  );
}

function Assistant() {
  return (
    <div className="pv-card pv-chat">
      <div className="pv-msg me"><T t="How do I request leave?" /></div>
      <div className="pv-msg bot">
        <T t="Open HR › Leave, pick your dates, and your manager is notified." />
      </div>
      <div className="pv-input">
        <span className="pv-line w60" />
        <i><T t="↑" /></i>
      </div>
    </div>
  );
}

function Integrations() {
  return (
    <div className="pv-hub">
      <div className="pv-hub-core"><T t="API" /></div>
      {["Pay", "Maps", "Mail", "CRM", "SMS", "Cloud"].map((name, i) => (
        <span key={name} className="pv-hub-node" style={{ ["--a" as string]: `${i * 60 - 90}deg` }}>
          <T t={name} />
        </span>
      ))}
    </div>
  );
}

const scenes = [Website, Dashboard, Mobile, Automation, Assistant, Integrations];

export function HeroPreview({ active }: { active: number }) {
  return (
    <span className="pv" aria-hidden="true">
      {scenes.map((Scene, i) => (
        <span key={i} className={`pv-scene ${i === active ? "is-active" : ""}`}>
          <Scene />
        </span>
      ))}
      <span className="pv-label">
        <span className="pv-dot" />
        <T t={previewLabels[active]} />
      </span>
      <span className="pv-progress">
        {scenes.map((_, i) => (
          <i key={i} className={i === active ? "is-active" : undefined} />
        ))}
      </span>
    </span>
  );
}
