import "reflect-metadata";
import type { MiddlewareHandler, ValidationTargets } from "hono";
import { validator as honoValidator } from "hono/validator";
import { z } from "zod";
import { MetadataMiddlewareConstant } from "App/Types/ControllerConstant.js";
import type Controller from "Controller/Controller.js";
import { onValidateError } from "Function/OnValidateError.js";

export type ZodData<V> = { [VK in keyof V]: any };

function reflectingMetadata(target: Function, func: MiddlewareHandler): void {
    if (!Reflect.hasMetadata(MetadataMiddlewareConstant, target)) {
        Reflect.defineMetadata(MetadataMiddlewareConstant, [func], target);
        return;
    }

    const metadata = Reflect.getMetadata(MetadataMiddlewareConstant, target) as MiddlewareHandler[];
    metadata.push(func);

    Reflect.deleteMetadata(MetadataMiddlewareConstant, target);
    Reflect.defineMetadata(MetadataMiddlewareConstant, metadata, target);
}

/**
 * Validate data for route.
 *
 * @param method - Target of request
 * @param data - Data to validate
 */
export function validator<T extends {}>(method: keyof ValidationTargets, data: ZodData<T>): Function {
    return function decorate(target: Controller, propKey: string, descriptor: PropertyDescriptor): void {
        const targetFunc = descriptor.value as Function;
        const funcValidator = honoValidator(method, (val, c) => {
            const parsed = z.object(data).safeParse(val);
            if (!parsed.success) return onValidateError(c, parsed.error.issues);
            return parsed.data;
        });
        reflectingMetadata(targetFunc, funcValidator);
    };
}

/**
 * Add middleware on route.
 *
 * @param handlers - Middleware handlers for route
 * @see MiddlewareHandler
 */
export function middleware(...handlers: MiddlewareHandler[] | Promise<MiddlewareHandler>[] | Promise<void>[]): Function {
    return function decorate(target: Controller, propKey: string, descriptor: PropertyDescriptor): void {
        const targetFunc = descriptor.value as Function;
        for (const handler of handlers) {
            const targetHandler = handler as MiddlewareHandler;
            reflectingMetadata(targetFunc, targetHandler);
        }
    };
}
