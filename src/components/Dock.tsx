import { prefersReducedMotion } from "../hooks/usePageFx";

/**
 * Floating dock: back-to-top with a reading-progress ring, a picks tray when
 * the visitor has chosen things in "What we build", and — on phones — a
 * persistent "Start a project" button. Hidden in the hero and at the contact form.
 */
export function Dock({ picks, onClear }: { picks: string[]; onClear: () => void }) {
  const toTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    document.querySelector<HTMLElement>(".header-brand")?.focus({ preventScroll: true });
  };
  const count = picks.length;

  return (
    <div className="dock">
      {count > 0 && (
        <div className="dock-picks" role="status">
          <span className="dock-count">{count}</span>
          <span className="dock-picks-text">
            <strong>{count === 1 ? "1 thing picked" : `${count} things picked`}</strong>
            <span>{picks.slice(0, 3).join(", ")}{count > 3 ? ` +${count - 3}` : ""}</span>
          </span>
          <a className="dock-continue" href="#contact">
            Continue <span aria-hidden="true">→</span>
          </a>
          <button type="button" className="dock-clear" onClick={onClear} aria-label="Clear all picks">
            ×
          </button>
        </div>
      )}
      <a className="dock-cta" href="#contact">
        {count > 0 ? `Continue with ${count} picked` : "Start a project"} <span aria-hidden="true">↗</span>
      </a>
      <button type="button" className="dock-top" onClick={toTop} aria-label="Back to top">
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle className="dock-ring-track" cx="24" cy="24" r="21" />
          <circle className="dock-ring" cx="24" cy="24" r="21" pathLength="100" />
        </svg>
        <span aria-hidden="true">↑</span>
      </button>
    </div>
  );
}
