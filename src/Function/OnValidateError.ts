import type { Context } from "hono";
import type { ZodData } from "App/Decorator/Middleware.js";
import ErrorBuilder from "App/Error/ErrorBuilder.js";
import isJson from "App/Function/IsJson.js";

export function onValidateError(c: Context<any, any, any>, data: ZodData<any>): Response {
    const code = 400;
    const builder = new ErrorBuilder("Bad request.", "Bad request performed.");
    builder
        .setKind(data)
        .setInstance(c.req.path)
        .setMDNCodeType(code);

    const jsonMethod = isJson(c.req.header());
    if (jsonMethod) return c.json(builder.build(), code);

    return c.text(builder.detail, code);
}
