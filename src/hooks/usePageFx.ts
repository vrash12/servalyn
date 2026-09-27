import { useEffect } from "react";

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Page-wide scroll state, written to <html> so CSS can react without re-renders:
 *  --progress        0 → 1 reading progress
 *  .past-hero        scrolled beyond the hero
 *  .scroll-down      currently scrolling down (the header tucks away)
 *  .contact-in-view  the contact section is on screen (floating CTAs step aside)
 *  .footer-in-view   the footer is on screen
 * Also runs the reveal-on-scroll observer for [data-reveal].
 */
export function usePageFx() {
  useEffect(() => {
    const root = document.documentElement;
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = Math.max(1, root.scrollHeight - window.innerHeight);
      root.style.setProperty("--progress", Math.min(1, Math.max(0, y / max)).toFixed(4));
      const heroEnd = (document.getElementById("top")?.offsetHeight ?? 700) * 0.75;
      root.classList.toggle("past-hero", y > heroEnd);
      if (y > lastY + 6 && y > 320) root.classList.add("scroll-down");
      else if (y < lastY - 6 || y <= 320) root.classList.remove("scroll-down");
      lastY = y;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    const observers: IntersectionObserver[] = [];
    const contact = document.getElementById("contact");
    if (contact && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        ([entry]) => root.classList.toggle("contact-in-view", entry.isIntersecting),
        { threshold: 0.12 },
      );
      io.observe(contact);
      observers.push(io);
    }
    const footer = document.querySelector(".site-footer");
    if (footer && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        ([entry]) => root.classList.toggle("footer-in-view", entry.isIntersecting),
        { threshold: 0.2 },
      );
      io.observe(footer);
      observers.push(io);
    }

    if ("IntersectionObserver" in window && !prefersReducedMotion()) {
      root.classList.add("can-reveal");
      // Clipped ("wipe") elements have no visible area yet, so we watch their parent instead.
      const targets = new Map<Element, Element[]>();
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const watch = el.dataset.reveal === "wipe" && el.parentElement ? el.parentElement : el;
        targets.set(watch, [...(targets.get(watch) ?? []), el]);
      });
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // An attribute, not a class: React re-renders overwrite className, which would hide the element again.
              targets.get(entry.target)?.forEach((el) => el.setAttribute("data-in", ""));
              io.unobserve(entry.target);
            }
          }),
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
      );
      targets.forEach((_, watch) => io.observe(watch));
      observers.push(io);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observers.forEach((io) => io.disconnect());
    };
  }, []);
}
