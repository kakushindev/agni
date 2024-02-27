import type { Context } from "hono";

export function onNotFound(c: Context<any, any, any>): Response {
    return c.json({
        message: "Path not found."
    }, 404);
}
