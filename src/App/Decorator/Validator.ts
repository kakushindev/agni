import "reflect-metadata";
import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import { z } from "zod";
import { MetadataValidatorConstant } from "App/Types/ControllerConstant.js";
import type Controller from "Controller/Controller.js";

/**
 * Set the path for route function.
 */
export default function validator<T extends {}>(method: keyof ValidationTargets, data: T): Function {
    return function decorate(target: Controller, propKey: string, descriptor: PropertyDescriptor): void {
        const targetFunc = descriptor.value as Function;
        Reflect.defineMetadata(
            MetadataValidatorConstant,
            zValidator(method, z.object(data)),
            targetFunc
        );
    };
}
