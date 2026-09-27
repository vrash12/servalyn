import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Logo } from "./Logo";

export const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#approach", label: "Approach" },
  { href: "#build", label: "What we build" },
  { href: "#faq", label: "FAQ" },
];

const spyIds = ["services", "work", "approach", "build", "faq", "contact"];

export function Header({ pickCount = 0 }: { pickCount?: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Scrollspy: highlight the section currently in the middle of the screen.
    if (!("IntersectionObserver" in window)) return;
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
        setActive(spyIds.find((id) => visible.get(id)) ?? "");
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    spyIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const menu = dialog.current;
    if (!menu) return;
    if (open && !menu.open) menu.showModal();
    if (!open && menu.open) menu.close();
    document.documentElement.classList.toggle("menu-open", open);
  }, [open]);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 960px)");
    const onChange = () => wide.matches && setOpen(false);
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  const trapFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const items = event.currentTarget.querySelectorAll<HTMLElement>("a[href], button");
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="wrap header-row">
          <a href="#top" className="header-brand" aria-label="Servalyn — back to top">
            <Logo />
          </a>
          <nav className="header-nav" aria-label="Main">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={isActive ? "is-active" : undefined}
                  aria-current={isActive ? "true" : undefined}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
          <a
            className={`pill pill-ink header-cta ${active === "contact" ? "is-active" : ""}`}
            href="#contact"
            data-magnetic
          >
            Start a project
            {pickCount > 0 ? (
              <b className="cta-count" aria-label={`${pickCount} picked`}>
                {pickCount}
              </b>
            ) : (
              <span aria-hidden="true">↗</span>
            )}
          </a>
          <button
            ref={trigger}
            type="button"
            className="menu-button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
          >
            Menu <span aria-hidden="true">+</span>
          </button>
        </div>
        <span className="header-progress" aria-hidden="true" />
      </header>

      <dialog
        id="site-menu"
        ref={dialog}
        className="site-menu"
        aria-label="Menu"
        onCancel={close}
        onClose={() => setOpen(false)}
        onKeyDown={trapFocus}
      >
        <div className="wrap menu-top">
          <Logo on="orange" markTone="ink" />
          <button type="button" className="menu-button" onClick={close}>
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav className="wrap menu-links" aria-label="Menu">
          {[...navLinks, { href: "#contact", label: "Contact" }].map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={close}
              className={active === link.href.slice(1) ? "is-active" : undefined}
              style={{ ["--d" as string]: `${80 + i * 55}ms` }}
            >
              <span className="label">({String(i + 1).padStart(2, "0")})</span>
              {link.label}
            </a>
          ))}
        </nav>
        <p className="wrap menu-note">
          Listen first. Then <em>pounce.</em>
        </p>
      </dialog>
    </>
  );
}
