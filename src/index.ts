import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { initialize } from "Initialize.js";
import Logger from "Logger.js";

const app = new Hono();
const port = 3_000;
await initialize(app);

Logger.info(`Server is running on port ${port}`);
serve({
    fetch: app.fetch,
    port
});
