import type { DefaultHonoContext } from "./Controller.js";
import Controller, { route } from "./Controller.js";

export default class HelloController extends Controller {
    @route("/hello")
    public hellow(c: DefaultHonoContext): void {
        c.json("Say hello world!");
    }
}
