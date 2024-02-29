import type { Context } from "hono";
import type { ZodData } from "App/Decorator/Validator.js";
import isJson from "App/Function/IsJson.js";

export function onValidateError(c: Context<any, any, any>, data: ZodData<any>): Response {
    const message = "Bad request performed.";
    const code = 400;
    const propsOnServer = Object.keys(data);

    const jsonMethod = isJson(c.req.header());
    if (jsonMethod) return c.json({ message, propsOnServer }, code);

    return c.text(message, code);
}
