import type { ZodString } from "zod";
import { z } from "zod";
import httpRoute from "App/Decorator/HttpRoute.js";
import validator from "App/Decorator/Validator.js";
import type { DefaultHonoContext, HonoInputContext } from "App/Types/ControllerTypes.js";
import Controller from "./Controller.js";

type HelloValidator = {
    message: ZodString | string;
};

export default class HelloController extends Controller {
    @httpRoute("get", "/")
    public hellow(c: DefaultHonoContext): Response {
        return c.text("Say hello world!");
    }

    /**
     * TODO [2024-02-26]: Set In/Out Typing for Validator whatever it takes.
     */
    @httpRoute("post", "/api")
    @validator<HelloValidator>("json", {
        message: z.string()
    })
    public helloApi(c: HonoInputContext<HelloValidator>): Response {
        const { message } = c.req.valid("json");
        return c.json(`Message: ${message as string}`);
    }
}
