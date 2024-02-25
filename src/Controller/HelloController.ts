import httpRoute from "App/Decorator/HttpRoute.js";
import type { DefaultHonoContext } from "App/Types/ControllerTypes.js";
import Controller from "./Controller.js";

export default class HelloController extends Controller {
    @httpRoute("get", "/")
    public hellow(c: DefaultHonoContext): Response {
        return c.text("Say hello world!");
    }
}
