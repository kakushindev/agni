import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { initialize } from "Initialize.js";

const app = new Hono();
const port = 3_000;
await initialize(app);

console.log(`Server is running on port ${port}`);
serve({
    fetch: app.fetch,
    port
});
