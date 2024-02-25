import type { DefaultHonoContext } from "./Controller.js";
import Controller, { route } from "./Controller.js";

export default class HelloController extends Controller {
    @route("get", "/")
    public hellow(c: DefaultHonoContext): Response {
        return c.text("Say hello world!");
    }
}
