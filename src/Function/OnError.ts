import type { Context, Env } from "hono";

export default function onError(err: Error, c: Context<Env, any, any>): Response {
    const errMessage = err.message;

    return c.json({
        message: "Something happened, but don't worry maybe it's you or our developer.",
        errMessage
    }, 500);
}
