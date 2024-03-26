import type { Context } from "hono";
import ErrorBuilder from "App/Error/ErrorBuilder.js";
import isJson from "App/Function/IsJson.js";

export function onNotFound(c: Context<any, any, any>): Response {
    const code = 404;
    const builder = new ErrorBuilder("Not found.", "Path or route not found.");
    builder
        .setInstance(c.req.path)
        .setType(`https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${code}`);

    const jsonMethod = isJson(c.req.header());
    if (jsonMethod) return c.json(builder.build(), code);

    return c.text(builder.detail, code);
}
