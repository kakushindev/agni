import "reflect-metadata";
import type { Context, Env, Hono } from "hono";
import type { BlankInput, BlankSchema, H } from "hono/types";

export type DefaultHonoContext = Context<Env, string, BlankInput>;
export type DefaultHonoFunctionContext = H<Env, string, BlankInput, Response>;

/**
 * Set the path for route function.
 *
 * @param path - Target path of route
 */
export function route(path: string): Function {
    return function decorate(target: Controller, propKey: string, descriptor: PropertyDescriptor): void {
        const targetFunc = descriptor.value as Function;
        Reflect.defineMetadata("decoratorRoute", path, targetFunc);
    };
}

/**
 * Base of Controller class.
 */
export default abstract class Controller {
    public constructor(public app: Hono<Env, BlankSchema, string>) {}
}
