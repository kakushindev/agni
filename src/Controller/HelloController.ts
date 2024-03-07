import type { Next } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import httpRoute from "App/Decorator/HttpRoute.js";
import { middleware, validator } from "App/Decorator/Middleware.js";
import type { DefaultHonoContext, HonoInputContext } from "App/Types/ControllerTypes.js";
import Logger from "Logger.js";
import Controller from "./Controller.js";

type HelloValidator = {
    message: string;
};

// Since we cannot calling this keyword on decorator,
// you must create some function outside the class or make some new function file.
async function indexMiddleware(_: DefaultHonoContext, next: Next): Promise<void> {
    Logger.info("You're accessing index!");
    await next();
    Logger.info("Done!");
}

export default class HelloController extends Controller {
    @httpRoute("get", "/")
    @middleware(cors())
    @middleware(indexMiddleware)
    public hellow(c: DefaultHonoContext): Response {
        return c.text("Say hello world!");
    }

    @httpRoute("post", "/api")
    @validator<HelloValidator>("json", {
        message: z.string()
    })
    public helloApi(c: HonoInputContext<HelloValidator>): Response {
        const { message } = c.req.valid("json");
        return c.json(`Message: ${message}`);
    }
}
