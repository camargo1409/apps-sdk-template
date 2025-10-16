import react from "@vitejs/plugin-react";
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

  const { createServer, searchForWorkspaceRoot } = await import("vite");
  const workspaceRoot = searchForWorkspaceRoot(process.cwd());
  const webAppRoot = path.join(workspaceRoot, "apps", "web");

  const vite = await createServer({
    configFile: false, // Disable the web config file
    plugins: [react()],
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
