import { McpServer as McpServerBase, type ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Resource } from "@modelcontextprotocol/sdk/types.js";
import type { ZodRawShape } from "zod";
import { readFileSync } from "fs";
import { join } from "path";

/** @see https://developers.openai.com/apps-sdk/reference#tool-descriptor-parameters */
type ToolMeta = {
  "openai/outputTemplate": string;
  "openai/widgetAccessible"?: boolean;
  "openai/toolInvocation/invoking"?: string;
  "openai/toolInvocation/invoked"?: string;
};

/** @see https://developers.openai.com/apps-sdk/reference#component-resource-_meta-fields */
type ResourceMeta = {
  "openai/widgetDescription"?: string;
  "openai/widgetPrefersBorder"?: boolean;
  "openai/widgetCSP"?: Record<"connect_domains" | "resource_domains", string[]>;
  "openai/widgetDomain"?: string;
};

type McpServerOriginalResourceConfig = Omit<Resource, "uri" | "name" | "mimeType">;

type McpServerOriginalToolConfig = Omit<Parameters<McpServer["registerTool"]>[1], "inputSchema" | "outputSchema">;

export class McpServer extends McpServerBase {
  widget<InputArgs extends ZodRawShape, OutputArgs extends ZodRawShape>(
    name: string,
    resourceConfig: McpServerOriginalResourceConfig,
    toolConfig: McpServerOriginalToolConfig & {
      inputSchema?: InputArgs;
      outputSchema?: OutputArgs;
    },
    toolCallback: ToolCallback<InputArgs>,
  ) {
    const uri = `ui://widgets/${name}.html`;
    const resourceMetadata: ResourceMeta = { ...(resourceConfig._meta ?? {}) };
    if (toolConfig.description !== undefined) {
      resourceMetadata["openai/widgetDescription"] = toolConfig.description;
    }

    this.resource(
      name,
      uri,
      {
        ...resourceConfig,
        _meta: resourceMetadata,
      },
      async (_uri, extra) => {
        const serverUrl =
          process.env.NODE_ENV === "production"
            ? `https://${extra?.requestInfo?.headers?.host}`
            : `http://localhost:3000`;

        const injectViteClient = (html: string) =>
          `
            <script type="module">import { injectIntoGlobalHook } from "${serverUrl}/@react-refresh";
            injectIntoGlobalHook(window);
            window.$RefreshReg$ = () => {};
            window.$RefreshSig$ = () => (type) => type;
            window.__vite_plugin_react_preamble_installed__ = true;
            </script>

            <script type="module" src="${serverUrl}/@vite/client"></script>
        ` + html;

        const buildHtml = () => {
          if (process.env.NODE_ENV === "production") {
            try {
              const cssPath = join(process.cwd(), "dist/assets/style.css");
              const cssContent = readFileSync(cssPath, "utf-8");
              const jsPath = join(process.cwd(), "dist/assets/index.js");
              const jsContent = readFileSync(jsPath, "utf-8");

              return `
                <div id="root"></div>
                <style>${cssContent}</style>
                <script type="module">
                  ${jsContent}
                  window.mountWidget('${name}');
                </script>
              `;
            } catch (error) {
              console.error("Failed to load production assets:", error);
              return "";
            }
          }

          return `
              <div id="root"></div>
              <script type="module">
              import React from "${serverUrl}/node_modules/.vite/deps/react.js";
              import ReactDOM from "${serverUrl}/node_modules/.vite/deps/react-dom_client.js";
                const waitForVite = () => {
                  return new Promise((resolve) => {
                    const checkVite = () => {
                      if (window.__vite_plugin_react_preamble_installed__) {
                        resolve();
                      } else {
                        setTimeout(checkVite, 10);
                      }
                    };
                    checkVite();
                  });
                };

                const mountWidget = async (widgetName, options = {}) => {
                  const container = document.getElementById("root");
                  if (!container) throw new Error('Element root not found');

                  const module = await import('${serverUrl}/src/widgets/' + widgetName + '.tsx');
                  const Component = module.default;

                  ReactDOM.createRoot(container).render(React.createElement(Component, options, null));
                };

                waitForVite().then(() => {
                  mountWidget('${name}');
                });
              </script>
            `;
        };

        const html = buildHtml();

        return {
          contents: [
            {
              uri,
              mimeType: "text/html+skybridge",
              text: process.env.NODE_ENV === "production" ? html : injectViteClient(html),
            },
          ],
        };
      },
    );

    const toolMeta: ToolMeta = {
      ...toolConfig._meta,
      "openai/outputTemplate": uri,
    };

    this.registerTool(
      name,
      {
        ...toolConfig,
        _meta: toolMeta,
      },
      toolCallback,
    );
  }
}
