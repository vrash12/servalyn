import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { site } from "../config";
import { serviceOptions } from "../content";
import { prefersReducedMotion } from "../hooks/usePageFx";

type Fields = {
  name: string;
  email: string;
  company: string;
  interest: string;
  timeline: string;
  budget: string;
  message: string;
};
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "draft"; href: string; body: string }
  | { kind: "error"; message: string };

const empty: Fields = {
  name: "",
  email: "",
  company: "",
  interest: "",
  timeline: "",
  budget: "",
  message: "",
};
const timelines = ["As soon as possible", "1–3 months", "3–6 months", "Flexible"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE = 10;

function compose(fields: Fields, picks: string[]) {
  const details = [
    `Name: ${fields.name.trim()}`,
    `Email: ${fields.email.trim()}`,
    fields.company.trim() && `Company: ${fields.company.trim()}`,
    fields.interest && `Interested in: ${fields.interest}`,
    picks.length > 0 && `Things we need: ${picks.join(", ")}`,
    fields.timeline && `Timeline: ${fields.timeline}`,
    fields.budget.trim() && `Budget: ${fields.budget.trim()}`,
  ].filter(Boolean);
  return `${details.join("\n")}\n\n${fields.message.trim()}`;
}

function ChipGroup({
  legend,
  name,
  options,
  value,
  onPick,
}: {
  legend: ReactNode;
  name: string;
  options: string[];
  value: string;
  onPick: (value: string) => void;
}) {
  return (
    <fieldset className="field chip-group">
      <legend className="field-label">{legend}</legend>
      <div className="chip-options">
        {options.map((option) => (
          <label key={option} className={`choice ${value === option ? "is-on" : ""}`}>
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onPick(option)}
              // Clicking the chosen chip again clears it — both groups are optional.
              onClick={() => value === option && onPick("")}
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Contact({
  interest,
  picks,
  onRemovePick,
  onClearPicks,
}: {
  interest: { value: string } | null;
  picks: string[];
  onRemovePick: (item: string) => void;
  onClearPicks: () => void;
}) {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [copied, setCopied] = useState(false);
  const statusBox = useRef<HTMLDivElement>(null);
  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  };

  useEffect(() => {
    if (interest) setFields((f) => ({ ...f, interest: interest.value }));
  }, [interest]);

  useEffect(() => {
    // Any change to the picks makes an earlier draft stale.
    setStatus((s) => (s.kind === "draft" ? { kind: "idle" } : s));
  }, [picks]);

  useEffect(() => {
    // Bring the result into view and move focus there for keyboard and screen-reader users.
    if (status.kind === "draft" || status.kind === "sent" || status.kind === "error") {
      const box = statusBox.current;
      box?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "nearest" });
      box?.querySelector<HTMLElement>("[data-focus]")?.focus({ preventScroll: true });
    }
  }, [status.kind]);

  const setField = (name: keyof Fields, value: string) => {
    setFields((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
    if (status.kind !== "idle" && status.kind !== "sending") setStatus({ kind: "idle" });
  };
  const update = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setField(event.target.name as keyof Fields, event.target.value);

  const checks = {
    name: fields.name.trim().length > 0,
    email: emailPattern.test(fields.email.trim()),
    message: fields.message.trim().length >= MIN_MESSAGE,
  };
  const done = Object.values(checks).filter(Boolean).length;

  const validate = () => {
    const next: typeof errors = {};
    if (!checks.name) next.name = "Please tell us your name.";
    if (!checks.email) next.email = "Please enter a valid email address.";
    if (!checks.message) next.message = "A sentence or two about your project helps us prepare.";
    setErrors(next);
    const first = (["name", "email", "message"] as const).find((key) => next[key]);
    if (first) refs[first].current?.focus();
    return !first;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    const body = compose(fields, picks);
    const subject = `Project inquiry — ${fields.name.trim()}${fields.company.trim() ? ` (${fields.company.trim()})` : ""}`;

    if (!site.contactEndpoint) {
      const href = site.email
        ? `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        : "";
      setCopied(false);
      setStatus({ kind: "draft", href, body });
      return;
    }

    setStatus({ kind: "sending" });
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(site.contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...fields, picks }),
        signal: controller.signal,
      });
      const data = response.ok ? await response.json().catch(() => null) : null;
      if (data && data.accepted === true) {
        setStatus({ kind: "sent" });
        setFields(empty);
        onClearPicks();
      } else {
        setStatus({ kind: "error", message: "We couldn’t confirm your message was received. Your details are still here — please try again or email us directly." });
      }
    } catch {
      setStatus({ kind: "error", message: "The message didn’t go through. Your details are still here — please try again or email us directly." });
    } finally {
      window.clearTimeout(timer);
    }
  };

  const copyDraft = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      /* Clipboard may be unavailable; the text stays visible for manual copying. */
    }
  };

  const messageLength = fields.message.trim().length;

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="section-head">
          <span className="label">(08)</span>
          <span className="label">Contact</span>
        </div>
        <div className="contact-grid">
          <div className="contact-copy">
            <h2 id="contact-title" className="contact-title">
              Let’s
              <br />
              <em>talk.</em>
            </h2>
            <p className="contact-lede">
              No pitch deck, no pressure. Tell us what you want to improve,
              automate, or create — we’ll take it from there.
            </p>
            {site.email && (
              <a className="contact-email" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            )}
            {site.phone && (
              <a className="contact-phone" href={`tel:${site.phone}`}>
                {site.phone}
              </a>
            )}
            <ol className="contact-next">
              <li><span className="label">01</span> We read every message and reply personally.</li>
              <li><span className="label">02</span> A short call to understand the problem.</li>
              <li><span className="label">03</span> A clear proposal with scope and next steps.</li>
            </ol>
          </div>

          <form className="contact-form" onSubmit={submit} noValidate>
            <div className="field-row">
              <div className={`field ${checks.name ? "is-valid" : ""}`}>
                <label htmlFor="c-name">Name *</label>
                <input ref={refs.name} id="c-name" name="name" autoComplete="name" value={fields.name} onChange={update} aria-invalid={!!errors.name} aria-describedby={errors.name ? "c-name-err" : undefined} />
                {errors.name && <span className="field-error" id="c-name-err">{errors.name}</span>}
              </div>
              <div className={`field ${checks.email ? "is-valid" : ""}`}>
                <label htmlFor="c-email">Email *</label>
                <input ref={refs.email} id="c-email" name="email" type="email" inputMode="email" autoComplete="email" value={fields.email} onChange={update} aria-invalid={!!errors.email} aria-describedby={errors.email ? "c-email-err" : undefined} />
                {errors.email && <span className="field-error" id="c-email-err">{errors.email}</span>}
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="c-company">Company <span>(optional)</span></label>
                <input id="c-company" name="company" autoComplete="organization" value={fields.company} onChange={update} />
              </div>
              <div className="field">
                <label htmlFor="c-budget">Budget <span>(optional)</span></label>
                <input id="c-budget" name="budget" placeholder="A range, with currency" value={fields.budget} onChange={update} />
              </div>
            </div>

            <ChipGroup legend="What do you need?" name="interest" options={serviceOptions} value={fields.interest} onPick={(v) => setField("interest", v)} />

            {picks.length > 0 && (
              <div className="field">
                <span className="field-label">
                  Your picks <span>({picks.length})</span>
                  <button type="button" className="field-clear" onClick={onClearPicks}>Clear</button>
                </span>
                <ul className="pick-list">
                  {picks.map((pick) => (
                    <li key={pick}>
                      {pick}
                      <button type="button" onClick={() => onRemovePick(pick)} aria-label={`Remove ${pick}`}>×</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ChipGroup legend={<>Timeline <span>(optional)</span></>} name="timeline" options={timelines} value={fields.timeline} onPick={(v) => setField("timeline", v)} />

            <div className={`field ${checks.message ? "is-valid" : ""}`}>
              <label htmlFor="c-message">About your project *</label>
              <textarea ref={refs.message} id="c-message" name="message" rows={5} placeholder="What’s slow, manual, or missing today? What would “done” look like?" value={fields.message} onChange={update} aria-invalid={!!errors.message} aria-describedby={`c-message-hint${errors.message ? " c-message-err" : ""}`} />
              <span className="field-hint" id="c-message-hint">
                {messageLength < MIN_MESSAGE
                  ? `A sentence or two is plenty.`
                  : `Looks good — ${messageLength} characters.`}
              </span>
              {errors.message && <span className="field-error" id="c-message-err">{errors.message}</span>}
            </div>

            <div className="form-foot">
              <div className="form-progress" aria-hidden="true">
                <span className="form-dots">
                  {(["name", "email", "message"] as const).map((k) => (
                    <i key={k} className={checks[k] ? "is-on" : undefined} />
                  ))}
                </span>
                <span className="label">{done === 3 ? "Ready to go" : `${done}/3 required`}</span>
              </div>
              <button className="pill pill-orange" type="submit" disabled={status.kind === "sending"} data-magnetic>
                {status.kind === "sending" ? "Sending…" : site.contactEndpoint ? "Send message" : "Prepare email"} <span aria-hidden="true">↗</span>
              </button>
            </div>
            <p className="form-note">
              {site.contactEndpoint
                ? "Your message goes straight to our team."
                : site.email
                  ? <>This prepares an email to {site.email} for you to review and send from your own email app.</>
                  : "Contact details are coming soon. You can preview your message below."}
            </p>

            <div className="form-status" role="status" aria-live="polite" ref={statusBox}>
              {status.kind === "sent" && <p className="status-ok" tabIndex={-1} data-focus>Thank you — your message was received. We’ll be in touch soon.</p>}
              {status.kind === "error" && <p className="status-error" tabIndex={-1} data-focus>{status.message}</p>}
              {status.kind === "draft" && (
                <div className="draft">
                  <p tabIndex={-1} data-focus>
                    <strong>Your draft is ready.</strong> Nothing has been sent yet — open it in your email app, review, and hit send.
                  </p>
                  <div className="draft-actions">
                    {status.href && (
                      <a className="pill pill-cream" href={status.href}>
                        Open email draft <span aria-hidden="true">↗</span>
                      </a>
                    )}
                    <button type="button" className={`text-link copy-link ${copied ? "is-copied" : ""}`} onClick={() => copyDraft(status.body)}>
                      {copied ? "Copied ✓" : "Copy message"}
                    </button>
                  </div>
                  <pre className="draft-preview">{status.body}</pre>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
