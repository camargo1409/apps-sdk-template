// src/main.ts
import { createRoot, type Root } from "react-dom/client";
import "./index.css";

interface WidgetOptions {
  [key: string]: unknown;
}

declare global {
  interface Window {
    mountWidget: (widgetName: string, elementId: string, options?: WidgetOptions) => Promise<void>;
  }
}

let currentRoot: Root | null = null;

window.mountWidget = async (widgetName, elementId, options = {}) => {
  const container = document.getElementById(elementId);
  if (!container) throw new Error(`Element ${elementId} not found`);

  const module = await import(`./widgets/${widgetName}.tsx`);
  const Component = module.default;

  currentRoot = createRoot(container);
  currentRoot.render(<Component {...options} />);
};
