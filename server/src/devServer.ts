import express, { RequestHandler } from "express";
import cors from "cors";
import path from "node:path";

/**
 * Install Vite dev server when env is not production
 * This router MUST be installed at the application root, like so:
 *
 *  const app = express();
 *  app.use(await widgetsRouter());
 */
export const widgetsRouter = async (): Promise<RequestHandler> => {
  const router = express.Router();

  if (process.env.NODE_ENV === "production") {
    return router;
  }

  const { createServer, searchForWorkspaceRoot, loadConfigFromFile } = await import("vite");
  const workspaceRoot = searchForWorkspaceRoot(process.cwd());
  const webAppRoot = path.join(workspaceRoot, "web");

  const configResult = await loadConfigFromFile(
    { command: "serve", mode: "development" },
    path.join(webAppRoot, "vite.config.ts"),
    webAppRoot,
  );

  // Remove build-specific options that don't apply to dev server
  const { build, preview, ...devConfig } = configResult?.config || {};

  const vite = await createServer({
    ...devConfig,
    configFile: false, // Keep this to prevent vite from trying to resolve path in the target config file
    appType: "custom",
    server: {
      allowedHosts: true,
      middlewareMode: true,
    },
    root: webAppRoot,
  });

  router.use(cors());
  router.use("/", vite.middlewares);

  return router;
};
