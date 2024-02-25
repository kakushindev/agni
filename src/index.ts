import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());
app.get("/", c => c.text("Hello Hono!"));

const port = 3_000;
console.log(`Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port
});
