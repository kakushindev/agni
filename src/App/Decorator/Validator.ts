import "reflect-metadata";
import type { MiddlewareHandler, ValidationTargets } from "hono";
import { validator as honoValidator } from "hono/validator";
import { z } from "zod";
import { MetadataMiddlewareConstant } from "App/Types/ControllerConstant.js";
import type Controller from "Controller/Controller.js";
import { onValidateError } from "Function/OnValidateError.js";

export type ZodData<V> = { [VK in keyof V]: any };

/**
 * Validate data for route.
 *
 * @param method - Target of request
 * @param data - Data to validate
 */
export default function validator<T extends {}>(method: keyof ValidationTargets, data: ZodData<T>): Function {
    return function decorate(target: Controller, propKey: string, descriptor: PropertyDescriptor): void {
        const targetFunc = descriptor.value as Function;
        const funcValidator = honoValidator(method, (val, c) => {
            const parsed = z.object(data).safeParse(val);
            if (!parsed.success) return onValidateError(c, data);
            return parsed.data;
        });

        if (!Reflect.hasMetadata(MetadataMiddlewareConstant, targetFunc)) {
            Reflect.defineMetadata(MetadataMiddlewareConstant, [funcValidator], targetFunc);
            return;
        }

        const metadata = Reflect.getMetadata(MetadataMiddlewareConstant, targetFunc) as MiddlewareHandler[];
        metadata.push(funcValidator);

        Reflect.deleteMetadata(MetadataMiddlewareConstant, targetFunc);
        Reflect.defineMetadata(MetadataMiddlewareConstant, metadata, targetFunc);
    };
}
