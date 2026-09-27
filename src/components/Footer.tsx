import { site } from "../config";
import { navLinks } from "./Header";
import { Logo } from "./Logo";

export function Footer() {
  const socials = [
    { label: "LinkedIn", href: site.linkedin },
    { label: "Facebook", href: site.facebook },
    { label: "Instagram", href: site.instagram },
  ].filter((s) => s.href);

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-cols">
          <div className="footer-brand">
            <Logo variant="full" />
            <p className="footer-tagline">
              Listen closely. Build precisely. <em>Move fast.</em>
            </p>
          </div>
          <nav className="footer-col" aria-label="Footer">
            <span className="label">Navigate</span>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
            <a href="#contact">Contact</a>
          </nav>
          <div className="footer-col">
            <span className="label">Say hello</span>
            {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
            {site.phone && <a href={`tel:${site.phone}`}>{site.phone}</a>}
            <a href="#contact">Start a project ↗</a>
          </div>
          {socials.length > 0 && (
            <div className="footer-col">
              <span className="label">Follow</span>
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>

        <a
          href="#contact"
          className="footer-mark"
          aria-label="Start a project with Servalyn"
          data-cursor="Let’s talk"
          onPointerMove={(e) => {
            // The print drifts with the pointer.
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * -120).toFixed(1)}px`);
            e.currentTarget.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * -60).toFixed(1)}px`);
          }}
        >
          <span aria-hidden="true">Servalyn</span>
        </a>

        <div className="footer-bottom">
          <span suppressHydrationWarning>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          {site.privacyUrl && <a href={site.privacyUrl}>Privacy</a>}
          {site.termsUrl && <a href={site.termsUrl}>Terms</a>}
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
