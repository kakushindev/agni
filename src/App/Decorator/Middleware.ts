import "reflect-metadata";
import type { MiddlewareHandler, Next, ValidationTargets } from "hono";
import { validator as honoValidator } from "hono/validator";
import { z } from "zod";
import { MetadataMiddlewareConstant } from "App/Types/ControllerConstant.js";
import type Controller from "Controller/Controller.js";
import { onValidateError } from "Function/OnValidateError.js";
import { DefaultHonoContext } from "App/Types/ControllerTypes.js";

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

type MiddlewareOperator = {
    type: "AND" | "OR";
    handlers: (MiddlewareHandler | MiddlewareOperator)[];
};

/**
 * Add OR Statement on handlers.
 *
 * @param handlers - Middleware handlers for route
 * @see MiddlewareHandler
 */
export function OR(...handlers: (MiddlewareHandler | MiddlewareOperator)[]): MiddlewareOperator {
    return {
        type: "OR",
        handlers
    };
}

/**
 * Add AND Statement on handlers.
 *
 * @param handlers - Middleware handlers for route
 * @see MiddlewareHandler
 */
export function AND(...handlers: (MiddlewareHandler | MiddlewareOperator)[]): MiddlewareOperator {
    return {
        type: "AND",
        handlers
    };
}

function isMiddlewareOperator(handler: any): handler is MiddlewareOperator {
    return handler && typeof handler === "object" && ("type" in handler) &&
        (handler.type === "OR" || handler.type === "AND");
}

async function executeOperator(
    operator: MiddlewareOperator,
    context: DefaultHonoContext,
    next: Next
): Promise<void> {
    if (operator.type === "OR") {
        let lastError: Error | null = null;
        for (const handler of operator.handlers) {
            try {
                await (isMiddlewareOperator(handler) ? executeOperator(handler, context, next) : handler(context, next));
                return;
            } catch (error) {
                console.log(error);
                lastError = error as Error;
                continue;
            }
        }
        throw lastError ?? new Error("Preconditions failed");
    } else if (operator.type === "AND") {
        for (const handler of operator.handlers) {
            await (isMiddlewareOperator(handler) ? executeOperator(handler, context, next) : handler(context, next));
        }
    }
}

/**
 * Add middleware on route.
 *
 * @param handlers - Middleware handlers for route
 * @see MiddlewareHandler
 * @example
 * Usage example:
 * ```ts
 * // OR Statement
 * middleware(
 *    OR(IsGuestSessionValid, IsLoggedIn)
 * )
 * ```
 * ```ts
 * // AND Statement
 * middleware(
 *    AND(IsLoggedIn, IsAdmin)
 * )
 * ```
 * ```ts
 * // Nested Statement
 * middleware(
 *    AND(
 *      OR(IsGuestSessionValid, IsLoggedIn)
 *      IsEditable
 *    )
 * )
 * ```
 */
export function middleware(...handlers: (MiddlewareHandler | MiddlewareOperator)[]): Function {
    return function decorate(target: any, propKey: string, descriptor: PropertyDescriptor): void {
        const originalMethod = descriptor.value as Function;

        descriptor.value = async function (...args: any[]) {
            const context = args[0] as DefaultHonoContext;
            const next = args[1] as Next;

            for (const handler of handlers) {
                await (isMiddlewareOperator(handler) ? executeOperator(handler, context, next) : handler(context, next));
            }

            return originalMethod.call(this, ...args);
        };
    };
}
