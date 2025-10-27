import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { McpServer } from "skybridge/server";
import { exerciseSchema, searchExercise } from "./workout-coach/api.js";

const server = new McpServer(
  {
    name: "alpic-openai-app",
    version: "0.0.1",
  },
  { capabilities: {} },
);


server.widget(
  "exercise",
  {
    description: "Exercises finder",
  },
  {
    description: "Use this tool to get exercises list",
    inputSchema: {
      name: z.string().describe("Muscle name"),
    },
    outputSchema: {
      exerciseList: z.array(exerciseSchema),
    },
  },
  async ({ name }): Promise<CallToolResult> => {
    try {
      const exerciseList = await searchExercise(name);

      return {
        /**
         * Arbitrary JSON passed only to the component.
         * Use it for data that should not influence the model’s reasoning, like the full set of locations that backs a dropdown.
         * _meta is never shown to the model.
         */
        _meta: { id: name },
        /**
         * Structured data that is used to hydrate your component.
         * ChatGPT injects this object into your iframe as window.openai.toolOutput
         */
        structuredContent: { exerciseList },
        /**
         * Optional free-form text that the model receives verbatim
         */
        content: [
          {
            type: "text",
            text: `${name} exercise list.`,
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

export default server;
