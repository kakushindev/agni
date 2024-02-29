import { randomUUID } from "node:crypto";
import type { Context, Env } from "hono";
import type { HTTPException } from "hono/http-exception";
import type { StatusCode } from "hono/utils/http-status";
import isJson from "App/Function/IsJson.js";
import Logger from "Logger.js";

type ErrorRecord = {
    message: string;
    errMessage?: string;
    uuidErr?: string;
};

export default function onError(err: Error, c: Context<Env, any, any>): Response {
    const errResponse: ErrorRecord = {
        message: ""
    };
    errResponse.message = "Something happened, but don't worry maybe it's you or our developer.";
    errResponse.errMessage = err.message;
    let code: StatusCode = 500;

    // Expecting this is HTTPError
    if (Object.keys(err).includes("status")) {
        const newErr = err as HTTPException;
        code = newErr.status;

        errResponse.message = newErr.message;
        delete errResponse.errMessage;
    }

    // If fatal error
    if (code === 500) {
        errResponse.uuidErr = randomUUID();
        Logger.child({ uuid: errResponse.uuidErr }).error(err, "Fatal error on server");
    }

    const jsonMethod = isJson(c.req.header());
    if (jsonMethod) return c.json(errResponse, code);

    // You can improve on this side, this is just example.
    let msgText = errResponse.message;
    if (errResponse.errMessage !== undefined) msgText += `\n${errResponse.errMessage}`;
    if (errResponse.uuidErr !== undefined) msgText += `\nUUID Code: ${errResponse.uuidErr}`;
    return c.text(msgText, code);
}
