import "reflect-metadata";
import type { Context, Env, Hono } from "hono";
import type { BlankInput, BlankSchema, H, HandlerInterface } from "hono/types";
import { InsufficientControllerMethodError, NotSupportedMethodError } from "Error/AppError.js";

export const MetadataConstant = "agniRouting";
export type AgniRoutingMetadata = {
    path: string;
    method: AgniSupportedMethod;
};

export type AgniSupportedMethod = "delete" | "get" | "patch" | "post" | "put";
export type DefaultHonoContext = Context<Env, string, BlankInput>;
export type DefaultHonoFunctionContext = H<Env, string, BlankInput, Response>;

/**
 * Set the path for GET route function.
 *
 * @param method - HTTP Method
 * @param path - Target path of route
 */
export function route(method: AgniSupportedMethod, path: string): Function {
    return function decorate(target: Controller, propKey: string, descriptor: PropertyDescriptor): void {
        const targetFunc = descriptor.value as Function;
        Reflect.defineMetadata(MetadataConstant, { path, method }, targetFunc);
    };
}

/**
 * Base of Controller class.
 */
export default class Controller {
    public constructor(public app: Hono<Env, BlankSchema, string>) {}

    public prepareClass(): void {
        const methodList = Object
            .getOwnPropertyNames(Object.getPrototypeOf(this))
            .filter(x => x !== "constructor");

        if (methodList.length <= 0) {
            throw new InsufficientControllerMethodError();
        }

        for (const method of methodList) {
            const func = (this as Record<string, any>)[method] as DefaultHonoFunctionContext | undefined;
            if (typeof func !== "function") return;
            if (!Reflect.hasMetadata(MetadataConstant, func)) return;

            const metadata = Reflect.getMetadata(MetadataConstant, func) as AgniRoutingMetadata;
            const honoApp = (this.app as Record<AgniSupportedMethod, any>)[metadata.method] as HandlerInterface | undefined;
            if (typeof honoApp !== "function") {
                throw new NotSupportedMethodError();
            }

            /**
             * TODO [2024-02-25]: Change hono `app` to Factory
             * https://hono.dev/guides/best-practices#factory-createhandlers-in-hono-factory
             */
            honoApp(metadata.path, c => c.text("Hello world!"));
        }
    }
}
