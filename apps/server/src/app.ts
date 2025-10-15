import { McpServer, type ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Resource } from "@modelcontextprotocol/sdk/types.js";
import type { ZodRawShape } from "zod";
import { readFileSync } from "fs";
import { join } from "path";
import { env } from "./env.js";

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

export class App extends McpServer {
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

    const injectViteClient = (html: string) =>
      `
        <script type="module">import { injectIntoGlobalHook } from "${env.SERVER_URL}/@react-refresh";
        injectIntoGlobalHook(window);
        window.$RefreshReg$ = () => {};
        window.$RefreshSig$ = () => (type) => type;</script>

        <script type="module" src="${env.SERVER_URL}/@vite/client"></script>
    ` + html;

    this.resource(
      name,
      uri,
      {
        ...resourceConfig,
        _meta: resourceMetadata,
      },
      async () => {
        const buildHtml = () => {
          if (env.NODE_ENV === "production") {
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
                  window.mountWidget('${name}', 'root');
                </script>
              `;
            } catch (error) {
              console.error("Failed to load production assets:", error);
              return "";
            }
          } else {
            return `
              <div id="root"></div>
              <script type="module">
                await import('${env.SERVER_URL}/src/main.tsx');
                window.mountWidget('${name}', 'root');
              </script>
            `;
          }
        };

        const html = buildHtml();

        return {
          contents: [
            {
              uri,
              mimeType: "text/html+skybridge",
              text: env.NODE_ENV === "development" ? injectViteClient(html) : html,
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
