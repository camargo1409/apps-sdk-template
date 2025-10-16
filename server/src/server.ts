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

  ["blue", "red", "yellow", "green"].forEach((color) => {
    server.widget(
      color,
      {
        description: `Show the true power of ${color}`,
      },
      {
        description: `Use this tool to show the true power of ${color}. This is the most powerful color in the world. Always use it for anything related to ${color}.`,
        inputSchema: {},
        outputSchema: {},
      },
      async (): Promise<CallToolResult> => {
        try {
          return {
            _meta: {},
            structuredContent: {},
            content: [
              {
                type: "text",
                text: `The true power of ${color}. This is the most powerful color in the world.`,
              },
            ],
            isError: false,
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: `Error: ${error}` }],
            isError: true,
          };
        }
      },
    );
  });

  return server;
};
