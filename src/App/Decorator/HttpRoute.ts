import "reflect-metadata";
import { MetadataConstant } from "App/Types/ControllerConstant.js";
import type { AgniSupportedMethod } from "App/Types/ControllerTypes.js";
import type Controller from "Controller/Controller.js";

/**
 * Set the path for route function.
 *
 * @param method - HTTP Method
 * @param path - Target path of route
 */
export default function httpRoute(method: AgniSupportedMethod, path: string): Function {
    return function decorate(target: Controller, propKey: string, descriptor: PropertyDescriptor): void {
        const targetFunc = descriptor.value as Function;
        Reflect.defineMetadata(MetadataConstant, { path, method }, targetFunc);
    };
}
