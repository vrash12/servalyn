import { projects } from "../content";

export function Work() {
  return (
    <section className="work section" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <div className="section-head">
          <span className="label">(03)</span>
          <span className="label">Selected work</span>
        </div>
        <div className="work-intro">
          <h2 id="work-title" className="display" data-reveal="wipe">
            Out in the <em>wild.</em>
          </h2>
          <p>Live projects, built and launched with the people who run them.</p>
        </div>

        <ol className="work-list">
          {projects.map((project, i) => {
            const host = project.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
            return (
              <li key={project.id} className="work-item" id={`work-${project.id}`}>
                <a
                  className="work-shot"
                  href={project.url}
                  target="_blank"
                  rel="noopener"
                  data-cursor="Visit"
                  aria-label={`Visit ${project.name} (opens in a new tab)`}
                >
                  <span className="work-bar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <span className="work-url">{host}</span>
                  </span>
                  <img
                    src={project.image.src}
                    width={project.image.width}
                    height={project.image.height}
                    alt={project.image.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
                <div className="work-body">
                  <p className="work-meta label">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span>{project.category}</span>
                    <span>{project.year}</span>
                  </p>
                  <h3 className="work-name">{project.name}</h3>
                  <p className="work-client">
                    {project.client} — <em>{project.sector}</em>
                  </p>
                  <p className="work-summary">{project.summary}</p>
                  <ul className="work-delivered" aria-label="What we delivered">
                    {project.delivered.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <ul className="work-stack" aria-label="Built with">
                    {project.stack.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                  <a
                    className="pill pill-ink work-cta"
                    href={project.url}
                    target="_blank"
                    rel="noopener"
                    data-magnetic
                  >
                    Visit {host} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
