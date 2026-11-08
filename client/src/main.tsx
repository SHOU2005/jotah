import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;
// Pages prerendered at build time are hydrated; everything else renders fresh.
if (root.dataset.ssr) hydrateRoot(root, <App />);
else createRoot(root).render(<App />);
