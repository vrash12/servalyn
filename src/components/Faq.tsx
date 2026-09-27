import { faqs } from "../content";

export function Faq() {
  return (
    <section className="faq section" id="faq" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <div>
          <div className="section-head">
            <span className="label">(07)</span>
            <span className="label">FAQ</span>
          </div>
          <h2 id="faq-title" className="display" data-reveal="wipe">
            Good
            <br />
            <em>questions.</em>
          </h2>
        </div>
        <div className="faq-list">
          {faqs.map((item) => (
            <details className="faq-item" key={item.q}>
              <summary>
                <span>{item.q}</span>
                <span className="faq-icon" aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
