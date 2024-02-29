import "reflect-metadata";
import type { ValidationTargets } from "hono";
import { validator as honoValidator } from "hono/validator";
import { z } from "zod";
import { MetadataValidatorConstant } from "App/Types/ControllerConstant.js";
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
        Reflect.defineMetadata(
            MetadataValidatorConstant,
            honoValidator(method, (val, c) => {
                const parsed = z.object(data).safeParse(val);

                if (!parsed.success) return onValidateError(c, data);

                return parsed.data;
            }),
            targetFunc
        );
    };
}
