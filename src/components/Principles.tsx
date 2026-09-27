import { principles, toolbox } from "../content";
import { techBadges, techIcons } from "../techIcons";

const toolCount = toolbox.reduce((n, row) => n + row.tools.length, 0);

function Tool({ name }: { name: string }) {
  const file = techIcons[name];
  return (
    <li className="tool">
      <span className="tool-icon" aria-hidden="true">
        {file ? (
          <img src={`/tech/${file}.svg`} alt="" width="20" height="20" loading="lazy" decoding="async" />
        ) : (
          <b>{techBadges[name] ?? name.slice(0, 2)}</b>
        )}
      </span>
      {name}
    </li>
  );
}

export function Principles() {
  return (
    <section className="principles section" aria-labelledby="principles-title">
      <div className="wrap">
        <div className="section-head">
          <span className="label">(06)</span>
          <span className="label">How we hold ourselves</span>
        </div>
        <h2 id="principles-title" className="display principles-title" data-reveal="wipe">
          Standards, <em>not slogans.</em>
        </h2>
        <div className="principle-grid">
          {principles.map((item, i) => (
            <article className="principle" key={item.title} data-reveal>
              <span className="principle-num" aria-hidden="true">
                {["i", "ii", "iii", "iv"][i]}
              </span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>

        <div className="toolbox">
          <div className="toolbox-head">
            <h3 className="label">Toolbox</h3>
            <p>
              <strong>{toolCount}</strong> technologies we design, build, and run
              with — chosen per project.
            </p>
          </div>
          <dl>
            {toolbox.map((row) => (
              <div className="toolbox-row" key={row.area}>
                <dt>{row.area}</dt>
                <dd>
                  <ul className="tool-list">
                    {row.tools.map((tool) => (
                      <Tool key={tool} name={tool} />
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
          <p className="toolbox-note">
            We pick tools for the job — never because a framework is trending.
          </p>
        </div>
      </div>
    </section>
  );
}
