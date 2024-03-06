import { z } from "zod";
import httpRoute from "App/Decorator/HttpRoute.js";
import { validator } from "App/Decorator/Middleware.js";
import type { DefaultHonoContext, HonoInputContext } from "App/Types/ControllerTypes.js";
import Controller from "./Controller.js";

type HelloValidator = {
    message: string;
};

export default class HelloController extends Controller {
    @httpRoute("get", "/")
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
