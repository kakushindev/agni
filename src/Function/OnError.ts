import type { Context, Env } from "hono";
import isJson from "App/Function/IsJson.js";

export default function onError(err: Error, c: Context<Env, any, any>): Response {
    const message = "Something happened, but don't worry maybe it's you or our developer.";
    const errMessage = err.message;
    const code = 500;

    const jsonMethod = isJson(c.req.header());
    if (jsonMethod) return c.json({ message, errMessage }, code);

    return c.text(`${message}\n${errMessage}`, code);
}
