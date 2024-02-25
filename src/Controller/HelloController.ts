import type { ZodString } from "zod";
import { z } from "zod";
import httpRoute from "App/Decorator/HttpRoute.js";
import validator from "App/Decorator/Validator.js";
import type { DefaultHonoContext } from "App/Types/ControllerTypes.js";
import Controller from "./Controller.js";

type HelloValidator = {
    message: ZodString;
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
    public helloApi(c: DefaultHonoContext): Response {
        return c.json("Lmao ngab");
    }
}
