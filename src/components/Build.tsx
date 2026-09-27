import { buildables } from "../content";

export function Build({
  picked,
  onToggle,
  onClear,
}: {
  picked: string[];
  onToggle: (item: string) => void;
  onClear: () => void;
}) {
  return (
    <section className="build section" id="build" aria-labelledby="build-title">
      <div className="wrap">
        <div className="section-head">
          <span className="label">(05)</span>
          <span className="label">What we build</span>
        </div>
        <div className="build-intro">
          <h2 id="build-title" className="display" data-reveal="wipe">
            Pick what you <em>need.</em>
          </h2>
          <p>
            Tap anything that sounds like your project. We’ll carry your picks
            straight into the contact form.
          </p>
        </div>
        <div className="build-cloud" role="group" aria-label="Things we build">
          {buildables.map((item) => {
            const on = picked.includes(item);
            return (
              <button
                key={item}
                type="button"
                className={`build-chip ${on ? "is-on" : ""}`}
                aria-pressed={on}
                data-cursor="pick"
                onClick={() => onToggle(item)}
              >
                {item}
              </button>
            );
          })}
        </div>
        <p className="build-status" role="status" aria-live="polite">
          {picked.length === 0 ? (
            <span className="label">Nothing picked yet — tap a few that fit.</span>
          ) : (
            <>
              <span className="label build-count">
                <b>{picked.length}</b> picked
              </span>
              <a className="pill pill-ink" href="#contact" data-magnetic>
                Continue to contact <span aria-hidden="true">↓</span>
              </a>
              <button type="button" className="text-link" onClick={onClear}>
                Clear all
              </button>
            </>
          )}
        </p>
      </div>
    </section>
  );
}
