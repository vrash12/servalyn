import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/sections.css";
import "./styles/enhancements.css";
import "./styles/preview.css";
import App from "./App";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The production build ships pre-rendered HTML (good for SEO) — hydrate it.
// In development the root is empty, so render from scratch.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
