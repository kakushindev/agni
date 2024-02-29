import type { Context } from "hono";
import isJson from "App/Function/IsJson.js";

export function onNotFound(c: Context<any, any, any>): Response {
    const message = "Path not found.";
    const code = 404;

    const jsonMethod = isJson(c.req.header());
    if (jsonMethod) return c.json({ message }, code);

    return c.text(message, code);
}
