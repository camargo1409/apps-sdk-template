import { z } from "zod";
import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { App } from "./app.js";

export const getServer = (): App => {
  const server = new App(
    {
      name: "alpic-openai-app",
      version: "0.0.1",
    },
    { capabilities: {} },
  );

  /**
   * This new widget API defines both a tool and a resource on the underlying MCP server.
   * The resource is used to display the tools ouput in a UI widget.
   */
  server.widget(
    "greet",
    {
      description: "Greet someone by his name",
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
          </style>
        </head>
        <body>
          <h1>Hello, World!</h1>
        </body>
      </html>
      `,
    },
    {
      inputSchema: {
        name: z.string().describe("Name to greet"),
      },
    },
    async ({ name }): Promise<CallToolResult> => {
      return {
        content: [
          {
            type: "text",
            text: `Hello, ${name}!`,
          },
        ],
        isError: false,
      };
    },
  );

  // MCP tools, resource and prompt APIs remains available and unchanged for other clients
  server.tool(
    "bye",
    "Say goodbye to someone by his name",
    {
      name: z.string().describe("Name to say goodbye to"),
    },
    async ({ name }): Promise<CallToolResult> => {
      return {
        content: [{ type: "text", text: `Goodbye, ${name}!` }],
        isError: false,
      };
    },
  );

  return server;
};
