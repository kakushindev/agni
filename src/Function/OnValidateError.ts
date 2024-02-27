import type { Context } from "hono";
import type { ZodData } from "App/Decorator/Validator.js";

export function onValidateError(c: Context<any, any, any>, data: ZodData<any>): Response {
    return c.json({
        message: "Bad request.",
        requiredProperty: Object.keys(data)
    }, 400);
}
