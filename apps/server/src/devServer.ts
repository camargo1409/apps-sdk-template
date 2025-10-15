import react from "@vitejs/plugin-react";
import { type Express } from "express";
import path from "node:path";

export const startDevServer = async (app: Express) => {
  const { createServer, searchForWorkspaceRoot } = await import("vite");

  const workspaceRoot = searchForWorkspaceRoot(process.cwd());
  const webAppRoot = path.join(workspaceRoot, "apps", "web");

  const vite = await createServer({
    configFile: false, // Disable the web config file
    plugins: [react()],
    logLevel: "warn",
    appType: "custom",
    server: {
      allowedHosts: true,
      middlewareMode: true,
    },
    root: webAppRoot,
  });

  app.use("/", vite.middlewares);
};
