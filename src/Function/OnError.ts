import { randomUUID } from "node:crypto";
import type { Context, Env } from "hono";
import { HTTPException } from "hono/http-exception";
import type { StatusCode } from "hono/utils/http-status";
import isJson from "App/Function/IsJson.js";
import Logger from "Logger.js";
import ErrorBuilder from "App/Error/ErrorBuilder.js";

type ErrorRecord = {
    message: string;
    errMessage?: string;
    uuidErr?: string;
};

export default function onError(err: Error, c: Context<Env, any, any>): Response {
    const builder = new ErrorBuilder(
        "Fatal error from server.", err.message
    );
    let code: StatusCode = 500;

    // Expecting this is HTTPError
    if (err instanceof HTTPException) {
        code = err.status;
        builder.setTitle("HTTP Error has thrown.");
    }

    if (code === 500) {
        builder.setKind({ errorId: randomUUID() });
    }

    const jsonMethod = isJson(c.req.header());
    if (jsonMethod) return c.json(builder.build(), code);

    // You can improve on this side, this is just example.
    return c.text(`Error: ${builder.title}\n${builder.detail}`, code);
}
