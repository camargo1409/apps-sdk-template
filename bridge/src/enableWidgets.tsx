import React from "react";
import { createRoot, type Root } from "react-dom/client";

interface WidgetOptions {
  [key: string]: unknown;
}

declare global {
  interface Window {
    mountWidget: (widgetName: string, options?: WidgetOptions) => Promise<void>;
  }
}

export const enableWidgets = () => {
  window.mountWidget = async (widgetName, options = {}) => {
    const container = document.getElementById("root");
    if (!container) throw new Error(`Element root not found`);

    const module = await import(`./widgets/${widgetName}.tsx`);
    const Component = module.default;

    createRoot(container).render(<Component {...options} />);
  };
};
