import { useEffect, useState } from "react";
import { services } from "../content";

export function Services({ onDiscuss }: { onDiscuss: (service: string) => void }) {
  const [open, setOpen] = useState<string | null>(services[0].id);

  useEffect(() => {
    // Links like #service-ai (from the hero index) open that service.
    const openFromHash = () => {
      const match = services.find((s) => window.location.hash === `#service-${s.id}`);
      if (match) setOpen(match.id);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <section className="services section" id="services" aria-labelledby="services-title">
      <div className="wrap">
        <div className="section-head">
          <span className="label">(02)</span>
          <span className="label">Services</span>
        </div>
        <div className="services-intro">
          <h2 id="services-title" className="display" data-reveal="wipe">
            Six ways we
            <br />
            <em>move you forward.</em>
          </h2>
          <p>
            From your first website to the systems that run your operations — one
            team, one standard, start to finish.
          </p>
        </div>

        <ol className="service-list">
          {services.map((service, i) => {
            const isOpen = open === service.id;
            return (
              <li key={service.id} className={`service ${isOpen ? "is-open" : ""}`} id={`service-${service.id}`}>
                <h3>
                  <button
                    type="button"
                    className="service-row"
                    aria-expanded={isOpen}
                    data-cursor="toggle"
                    aria-controls={`service-panel-${service.id}`}
                    onClick={() => setOpen(isOpen ? null : service.id)}
                  >
                    <span className="service-num label">{String(i + 1).padStart(2, "0")}</span>
                    <span className="service-title">{service.title}</span>
                    <span className="service-kicker">{service.kicker}</span>
                    <span className="service-toggle" aria-hidden="true" />
                  </button>
                </h3>
                <div
                  id={`service-panel-${service.id}`}
                  className="service-panel"
                  role="region"
                  aria-label={service.title}
                  hidden={!isOpen}
                >
                  <p className="service-summary">{service.summary}</p>
                  <ul className="service-items">
                    {service.items.map((item, j) => (
                      <li key={item} style={{ ["--i" as string]: j }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="pill pill-ink service-cta"
                    data-magnetic
                    onClick={() => onDiscuss(service.title)}
                  >
                    Discuss {service.title.toLowerCase()} <span aria-hidden="true">→</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
