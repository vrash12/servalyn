import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../hooks/usePageFx";

const INTERACTIVE = "a, button, summary, label, [data-cursor]";

function labelFor(el: Element | null): string {
  if (!el) return "";
  const kind = (el as HTMLElement).dataset.cursor;
  if (!kind) return "";
  if (kind === "toggle") return el.getAttribute("aria-expanded") === "true" ? "Close" : "Open";
  if (kind === "pick") return el.getAttribute("aria-pressed") === "true" ? "Unpick" : "Pick";
  return kind;
}

/**
 * A soft orange spot that trails the pointer (the native cursor stays visible).
 * It rings interactive elements, shows a label bubble on big targets, and pulls
 * [data-magnetic] buttons slightly toward the pointer. Fine pointers only.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const check = () => setEnabled(fine.matches && !prefersReducedMotion());
    check();
    fine.addEventListener("change", check);
    return () => fine.removeEventListener("change", check);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = dot.current;
    const text = label.current;
    if (!el || !text) return;
    document.documentElement.classList.add("has-cursor");

    let x = -100, y = -100, cx = -100, cy = -100;
    let frame = 0;
    let magnet: HTMLElement | null = null;

    const loop = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      frame = Math.abs(x - cx) + Math.abs(y - cy) > 0.1 ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(loop);
    };

    const releaseMagnet = () => {
      if (magnet) magnet.style.translate = "";
      magnet = null;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      el.classList.add("is-visible");
      kick();

      const target = e.target as Element;
      const interactive = target.closest(INTERACTIVE);
      const text$ = labelFor(target.closest("[data-cursor]"));
      el.classList.toggle("is-hover", !!interactive && !text$);
      el.classList.toggle("is-label", !!text$);
      el.classList.toggle("is-hidden", !!target.closest("input, textarea, select, .draft-preview"));
      el.classList.toggle("on-dark", !!target.closest(".approach, .contact, .tape-ink, .site-menu"));
      if (text$ && text.textContent !== text$) text.textContent = text$;

      const m = target.closest<HTMLElement>("[data-magnetic]");
      if (m !== magnet) releaseMagnet();
      if (m) {
        magnet = m;
        const r = m.getBoundingClientRect();
        const dx = (x - (r.left + r.width / 2)) * 0.22;
        const dy = (y - (r.top + r.height / 2)) * 0.3;
        m.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
      }
    };
    const onLeave = () => {
      el.classList.remove("is-visible");
      releaseMagnet();
    };
    const onDown = () => el.classList.add("is-down");
    const onUp = () => el.classList.remove("is-down");

    // Content moves under a still pointer while scrolling — drop stale labels.
    const onScroll = () => el.classList.remove("is-label", "is-hover");
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("blur", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      releaseMagnet();
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className="cursor" ref={dot} aria-hidden="true">
      <span className="cursor-spot" />
      <span className="cursor-label" ref={label} />
    </div>
  );
}
