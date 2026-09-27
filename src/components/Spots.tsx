import { useEffect, useId, useMemo, useRef } from "react";
import { makeSpots } from "../spots";
import { prefersReducedMotion } from "../hooks/usePageFx";

/**
 * A block of serval print. Decorative only.
 * With `interactive`, spots scatter away from the pointer and drift back.
 */
export function Spots({
  width = 400,
  height = 200,
  radius = 0,
  seed = 7,
  cell = 34,
  minR = 5,
  maxR = 11,
  bg = "var(--orange)",
  fg = "var(--ink)",
  className = "",
  interactive = false,
}: {
  width?: number;
  height?: number;
  radius?: number;
  seed?: number;
  cell?: number;
  minR?: number;
  maxR?: number;
  bg?: string;
  fg?: string;
  className?: string;
  interactive?: boolean;
}) {
  const clip = `spots-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const svg = useRef<SVGSVGElement>(null);
  const spots = useMemo(
    () => makeSpots(width, height, { seed, cell, minR, maxR }),
    [width, height, seed, cell, minR, maxR],
  );

  useEffect(() => {
    const el = svg.current;
    if (!interactive || !el || prefersReducedMotion()) return;
    const groups = Array.from(el.querySelectorAll<SVGGElement>(".spot-wrap"));
    const reach = Math.max(width, height) * 0.32;
    const push = cell * 0.9;
    let frame = 0;
    let px = 0, py = 0;

    const apply = () => {
      frame = 0;
      spots.forEach((s, i) => {
        const dx = s.cx - px;
        const dy = s.cy - py;
        const d = Math.hypot(dx, dy) || 1;
        const f = d < reach ? (1 - d / reach) ** 2 : 0;
        groups[i].style.translate = f ? `${((dx / d) * f * push).toFixed(1)}px ${((dy / d) * f * push).toFixed(1)}px` : "";
      });
    };
    const onMove = (e: PointerEvent) => {
      const ctm = el.getScreenCTM();
      if (!ctm) return;
      const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
      px = pt.x;
      py = pt.y;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      groups.forEach((g) => (g.style.translate = ""));
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [interactive, spots, width, height, cell]);

  return (
    <svg
      ref={svg}
      className={`spots ${interactive ? "is-interactive" : ""} ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <clipPath id={clip}>
        <rect width={width} height={height} rx={radius} />
      </clipPath>
      <rect width={width} height={height} rx={radius} style={{ fill: bg }} />
      <g clipPath={`url(#${clip})`} style={{ fill: fg }}>
        {spots.map((s, i) => (
          <g className="spot-wrap" key={i}>
            <g transform={`rotate(${s.rot.toFixed(1)} ${s.cx.toFixed(1)} ${s.cy.toFixed(1)})`}>
              <ellipse
                className="spot"
                cx={s.cx.toFixed(1)}
                cy={s.cy.toFixed(1)}
                rx={s.rx.toFixed(1)}
                ry={s.ry.toFixed(1)}
                style={{ ["--i" as string]: i % 12 }}
              />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}
