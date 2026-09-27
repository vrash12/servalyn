// Server entry used only at build time to pre-render the page to static HTML
// (see scripts/prerender.mjs). Search engines and link previews get the full
// content immediately; the browser then hydrates it into the interactive app.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

export { site } from "./config";
export { services, faqs, toolbox, projects } from "./content";

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
